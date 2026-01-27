# EmailApi

All URIs are relative to *https://api.oxinion.com/v1*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**sendEmail**](EmailApi.md#sendemailoperation) | **POST** /email/send | Send email |



## sendEmail

> EmailResponse sendEmail(sendEmailRequest)

Send email

### Example

```ts
import {
  Configuration,
  EmailApi,
} from '';
import type { SendEmailOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new EmailApi(config);

  const body = {
    // SendEmailRequest
    sendEmailRequest: ...,
  } satisfies SendEmailOperationRequest;

  try {
    const data = await api.sendEmail(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **sendEmailRequest** | [SendEmailRequest](SendEmailRequest.md) |  | |

### Return type

[**EmailResponse**](EmailResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Email sent successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

