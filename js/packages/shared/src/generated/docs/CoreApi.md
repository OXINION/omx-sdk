# CoreApi

All URIs are relative to *https://api.oxinion.com/v1*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**authenticate**](CoreApi.md#authenticate) | **POST** /auth | Authenticate client |



## authenticate

> AuthResponse authenticate(authRequest)

Authenticate client

### Example

```ts
import {
  Configuration,
  CoreApi,
} from '';
import type { AuthenticateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CoreApi(config);

  const body = {
    // AuthRequest
    authRequest: ...,
  } satisfies AuthenticateRequest;

  try {
    const data = await api.authenticate(body);
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
| **authRequest** | [AuthRequest](AuthRequest.md) |  | |

### Return type

[**AuthResponse**](AuthResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Authentication successful |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

