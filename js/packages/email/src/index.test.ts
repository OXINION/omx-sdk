import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EmailManager } from './index.js';
import { OMXClient } from '@omx-sdk/core';

describe('EmailManager', () => {
  let emailManager: EmailManager;
  let mockClient: OMXClient;

  beforeEach(() => {
    mockClient = {
      makeRequest: vi.fn(),
    } as any;
    emailManager = new EmailManager(mockClient);
  });

  it('should send email', async () => {
    const emailData = {
      to: 'test@example.com',
      subject: 'Test Email',
      content: 'This is a test email',
    };
    
    const expectedResult = {
      messageId: 'email123',
      status: 'sent'
    };

    (mockClient.makeRequest as any).mockResolvedValue(expectedResult);

    const result = await emailManager.send(emailData);

    expect(mockClient.makeRequest).toHaveBeenCalledWith('/emails/send', {
      method: 'POST',
      body: JSON.stringify(emailData),
    });
    expect(result).toEqual(expectedResult);
  });

  it('should create email template', async () => {
    const template = {
      name: 'Welcome Email',
      subject: 'Welcome!',
      htmlContent: '<h1>Welcome!</h1>',
      variables: ['firstName', 'lastName']
    };
    
    const expectedResult = {
      id: 'template123',
      ...template
    };

    (mockClient.makeRequest as any).mockResolvedValue(expectedResult);

    const result = await emailManager.createTemplate(template);

    expect(mockClient.makeRequest).toHaveBeenCalledWith('/emails/templates', {
      method: 'POST',
      body: JSON.stringify(template),
    });
    expect(result).toEqual(expectedResult);
  });
});
