
# Geotrigger


## Properties

Name | Type
------------ | -------------
`id` | string
`name` | string
`latitude` | number
`longitude` | number
`radius` | number
`active` | boolean
`createdAt` | Date
`updatedAt` | Date

## Example

```typescript
import type { Geotrigger } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "latitude": null,
  "longitude": null,
  "radius": null,
  "active": null,
  "createdAt": null,
  "updatedAt": null,
} satisfies Geotrigger

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Geotrigger
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


