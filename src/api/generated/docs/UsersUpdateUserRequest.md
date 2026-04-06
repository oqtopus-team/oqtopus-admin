# UsersUpdateUserRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**email** | **string** |  | [optional] [default to undefined]
**display_name** | **string** |  | [optional] [default to undefined]
**organization** | **string** |  | [optional] [default to undefined]
**status** | [**UsersUserStatus**](UsersUserStatus.md) |  | [optional] [default to undefined]
**group_id** | **string** |  | [optional] [default to undefined]
**available_devices** | [**UsersGetOneUserResponseAvailableDevices**](UsersGetOneUserResponseAvailableDevices.md) |  | [optional] [default to undefined]

## Example

```typescript
import { UsersUpdateUserRequest } from './api';

const instance: UsersUpdateUserRequest = {
    email,
    display_name,
    organization,
    status,
    group_id,
    available_devices,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
