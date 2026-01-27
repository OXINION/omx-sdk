
# SendEmailRequest


## Properties

Name | Type
------------ | -------------
`to` | Array&lt;string&gt;
`subject` | string
`content` | string
`templateId` | string

## Example

```typescript
import type { SendEmailRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "to": null,
  "subject": null,
  "content": null,
  "templateId": null,
} satisfies SendEmailRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SendEmailRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


