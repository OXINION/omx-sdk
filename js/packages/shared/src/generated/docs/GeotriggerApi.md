# GeotriggerApi

All URIs are relative to the configured base URL (default: *https://blhilidnsybhfdmwqsrx.supabase.co/functions/v1*)

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createGeotrigger**](GeotriggerApi.md#creategeotriggeroperation) | **POST** /geotriggers | Create geotrigger |
| [**listGeotriggers**](GeotriggerApi.md#listgeotriggers) | **GET** /geotriggers | List geotriggers |



## createGeotrigger

> Geotrigger createGeotrigger(createGeotriggerRequest)

Create geotrigger

### Example

```ts
import {
  Configuration,
  GeotriggerApi,
} from '';
import type { CreateGeotriggerOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new GeotriggerApi(config);

  const body = {
    // CreateGeotriggerRequest
    createGeotriggerRequest: ...,
  } satisfies CreateGeotriggerOperationRequest;

  try {
    const data = await api.createGeotrigger(body);
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
| **createGeotriggerRequest** | [CreateGeotriggerRequest](CreateGeotriggerRequest.md) |  | |

### Return type

[**Geotrigger**](Geotrigger.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Geotrigger created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listGeotriggers

> Array&lt;Geotrigger&gt; listGeotriggers()

List geotriggers

### Example

```ts
import {
  Configuration,
  GeotriggerApi,
} from '';
import type { ListGeotriggersRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new GeotriggerApi(config);

  try {
    const data = await api.listGeotriggers();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;Geotrigger&gt;**](Geotrigger.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of geotriggers |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

