# WhitelistUsersApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**deleteWhitelistUser**](#deletewhitelistuser) | **DELETE** /whitelist_users | delete a user from the whitelist|
|[**listWhitelistUsers**](#listwhitelistusers) | **GET** /whitelist_users | List whitelist users|
|[**registerWhitelistUser**](#registerwhitelistuser) | **POST** /whitelist_users | register a user to the whitelist|

# **deleteWhitelistUser**
> deleteWhitelistUser(whitelistUsersWhitelistUsersDeleteRequest)

delete a user from the whitelist

### Example

```typescript
import {
    WhitelistUsersApi,
    Configuration,
    WhitelistUsersWhitelistUsersDeleteRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new WhitelistUsersApi(configuration);

let whitelistUsersWhitelistUsersDeleteRequest: WhitelistUsersWhitelistUsersDeleteRequest; //

const { status, data } = await apiInstance.deleteWhitelistUser(
    whitelistUsersWhitelistUsersDeleteRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **whitelistUsersWhitelistUsersDeleteRequest** | **WhitelistUsersWhitelistUsersDeleteRequest**|  | |


### Return type

void (empty response body)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Delete success |  -  |
|**401** | Unauthorized |  -  |
|**403** | Not authorized : user is not admin |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listWhitelistUsers**
> WhitelistUsersListWhitelistUsersResponse listWhitelistUsers()

List whitelist users

### Example

```typescript
import {
    WhitelistUsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WhitelistUsersApi(configuration);

let offset: string; //offset information (optional) (default to undefined)
let limit: string; //Limit information (optional) (default to undefined)

const { status, data } = await apiInstance.listWhitelistUsers(
    offset,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **offset** | [**string**] | offset information | (optional) defaults to undefined|
| **limit** | [**string**] | Limit information | (optional) defaults to undefined|


### Return type

**WhitelistUsersListWhitelistUsersResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Return a list of whitelist users |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**403** | Not authorized : user is not admin |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **registerWhitelistUser**
> SuccessSuccessResponse registerWhitelistUser()

register a user to the whitelist

### Example

```typescript
import {
    WhitelistUsersApi,
    Configuration,
    WhitelistUsersRegisterWhitelistUsersRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new WhitelistUsersApi(configuration);

let whitelistUsersRegisterWhitelistUsersRequest: WhitelistUsersRegisterWhitelistUsersRequest; // (optional)

const { status, data } = await apiInstance.registerWhitelistUser(
    whitelistUsersRegisterWhitelistUsersRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **whitelistUsersRegisterWhitelistUsersRequest** | **WhitelistUsersRegisterWhitelistUsersRequest**|  | |


### Return type

**SuccessSuccessResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success register a user to the whitelist |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**403** | Not authorized : user is not admin |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

