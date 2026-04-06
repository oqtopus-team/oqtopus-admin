# WhitelistUsersRegisterWhitelistUserRequest

Whitelist user register request

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**group_id** | **string** |  | [optional] [default to undefined]
**email** | **string** |  | [optional] [default to undefined]
**display_name** | **string** |  | [optional] [default to undefined]
**organization** | **string** |  | [optional] [default to undefined]
**available_devices** | [**UsersGetOneUserResponseAvailableDevices**](UsersGetOneUserResponseAvailableDevices.md) |  | [optional] [default to undefined]

## Example

```typescript
import { WhitelistUsersRegisterWhitelistUserRequest } from './api';

const instance: WhitelistUsersRegisterWhitelistUserRequest = {
    group_id,
    email,
    display_name,
    organization,
    available_devices,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
