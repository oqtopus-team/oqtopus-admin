# UserApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**deleteUserById**](#deleteuserbyid) | **DELETE** /users/{user_id} | delete user|
|[**getOneUserById**](#getoneuserbyid) | **GET** /users/{user_id} | get one user|
|[**getUsers**](#getusers) | **GET** /users | get users|
|[**updatetUserStatusById**](#updatetuserstatusbyid) | **PATCH** /users/{user_id} | update user status|

# **deleteUserById**
> deleteUserById()

delete user with designated id

### Example

```typescript
import {
    UserApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let userId: string; //User ID (default to undefined)

const { status, data } = await apiInstance.deleteUserById(
    userId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**string**] | User ID | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Success |  -  |
|**401** | Unauthorized |  -  |
|**403** | Not authorized |  -  |
|**404** | Not found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getOneUserById**
> UsersGetOneUserResponse getOneUserById()

get one user

### Example

```typescript
import {
    UserApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let userId: string; //User ID (default to undefined)

const { status, data } = await apiInstance.getOneUserById(
    userId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**string**] | User ID | defaults to undefined|


### Return type

**UsersGetOneUserResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**404** | Not found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getUsers**
> UsersGetUsersResponse getUsers()

get users

### Example

```typescript
import {
    UserApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let offset: string; //offset information (optional) (default to undefined)
let limit: string; //Limit information (optional) (default to undefined)
let userId: string; //query user id (optional) (default to undefined)
let email: string; //query email information (optional) (default to undefined)
let displayName: string; //query display name information (optional) (default to undefined)
let organization: string; //query organization information (optional) (default to undefined)
let status: UsersUserStatus; //query user status (optional) (default to undefined)
let groupId: string; //query group ID (optional) (default to undefined)

const { status, data } = await apiInstance.getUsers(
    offset,
    limit,
    userId,
    email,
    displayName,
    organization,
    status,
    groupId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **offset** | [**string**] | offset information | (optional) defaults to undefined|
| **limit** | [**string**] | Limit information | (optional) defaults to undefined|
| **userId** | [**string**] | query user id | (optional) defaults to undefined|
| **email** | [**string**] | query email information | (optional) defaults to undefined|
| **displayName** | [**string**] | query display name information | (optional) defaults to undefined|
| **organization** | [**string**] | query organization information | (optional) defaults to undefined|
| **status** | **UsersUserStatus** | query user status | (optional) defaults to undefined|
| **groupId** | [**string**] | query group ID | (optional) defaults to undefined|


### Return type

**UsersGetUsersResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**403** | Not authorized : user is not admin |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updatetUserStatusById**
> UsersGetOneUserResponse updatetUserStatusById(usersUpdateUserRequest)

update user status

### Example

```typescript
import {
    UserApi,
    Configuration,
    UsersUpdateUserRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let userId: string; //User ID (default to undefined)
let usersUpdateUserRequest: UsersUpdateUserRequest; //

const { status, data } = await apiInstance.updatetUserStatusById(
    userId,
    usersUpdateUserRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **usersUpdateUserRequest** | **UsersUpdateUserRequest**|  | |
| **userId** | [**string**] | User ID | defaults to undefined|


### Return type

**UsersGetOneUserResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**401** | Unauthorized |  -  |
|**403** | Not authorized |  -  |
|**404** | Not found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

