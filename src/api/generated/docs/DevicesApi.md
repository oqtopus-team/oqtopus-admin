# DevicesApi

All URIs are relative to _http://localhost:8080_

| Method                                                | HTTP request                                    | Description                                    |
| ----------------------------------------------------- | ----------------------------------------------- | ---------------------------------------------- |
| [**deleteDevice**](#deletedevice)                     | **DELETE** /devices/{device_id}                 | Delete a device                                |
| [**deleteDeviceHistory**](#deletedevicehistory)       | **DELETE** /device_histories/{history_id}       | Delete device history                          |
| [**getDevice**](#getdevice)                           | **GET** /devices/{device_id}                    | Get specified device details                   |
| [**getDeviceHistory**](#getdevicehistory)             | **GET** /device_histories/{history_id}          | Get device history                             |
| [**getDeviceInfoUploadUrl**](#getdeviceinfouploadurl) | **GET** /devices/{device_id}/device_info/upload | Generate a presigned URL to upload device_info |
| [**listDeviceHistories**](#listdevicehistories)       | **GET** /device_histories                       | List device histories                          |
| [**listDevices**](#listdevices)                       | **GET** /devices                                | List available devices                         |
| [**registerDevice**](#registerdevice)                 | **POST** /devices                               | Register a new device                          |
| [**updateDeviceData**](#updatedevicedata)             | **PATCH** /devices/{device_id}                  | Update data of selected device                 |

# **deleteDevice**

> SuccessSuccessResponse deleteDevice()

Delete a device from the system.

### Example

```typescript
import { DevicesApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new DevicesApi(configuration);

let deviceId: string; //Device ID (default to undefined)

const { status, data } = await apiInstance.deleteDevice(deviceId);
```

### Parameters

| Name         | Type         | Description | Notes                 |
| ------------ | ------------ | ----------- | --------------------- |
| **deviceId** | [**string**] | Device ID   | defaults to undefined |

### Return type

**SuccessSuccessResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details

| Status code | Description           | Response headers |
| ----------- | --------------------- | ---------------- |
| **204**     | Device deleted        | -                |
| **400**     | Bad Request           | -                |
| **401**     | Unauthorized          | -                |
| **403**     | Not authorized        | -                |
| **404**     | Not Found             | -                |
| **500**     | Internal Server Error | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteDeviceHistory**

> deleteDeviceHistory()

Deletes the device history metadata and archived device_info object identified by history_id.

### Example

```typescript
import { DevicesApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new DevicesApi(configuration);

let historyId: string; //Unique string identifying the device history. (default to undefined)

const { status, data } = await apiInstance.deleteDeviceHistory(historyId);
```

### Parameters

| Name          | Type         | Description                                   | Notes                 |
| ------------- | ------------ | --------------------------------------------- | --------------------- |
| **historyId** | [**string**] | Unique string identifying the device history. | defaults to undefined |

### Return type

void (empty response body)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details

| Status code | Description              | Response headers |
| ----------- | ------------------------ | ---------------- |
| **204**     | Device history deleted   | -                |
| **404**     | Device history not found | -                |
| **500**     | Internal Server Error    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getDevice**

> DevicesDeviceInfo getDevice()

get device

### Example

```typescript
import { DevicesApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new DevicesApi(configuration);

let deviceId: string; //Device identifier (default to undefined)

const { status, data } = await apiInstance.getDevice(deviceId);
```

### Parameters

| Name         | Type         | Description       | Notes                 |
| ------------ | ------------ | ----------------- | --------------------- |
| **deviceId** | [**string**] | Device identifier | defaults to undefined |

### Return type

**DevicesDeviceInfo**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details

| Status code | Description                     | Response headers |
| ----------- | ------------------------------- | ---------------- |
| **200**     | device response                 | -                |
| **404**     | Device with device_id not found | -                |
| **500**     | Internal Server Error           | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getDeviceHistory**

> DevicesDeviceInfoHistoryDetail getDeviceHistory()

Returns the device history identified by history_id.

### Example

```typescript
import { DevicesApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new DevicesApi(configuration);

let historyId: string; //Unique string identifying the device history. (default to undefined)

const { status, data } = await apiInstance.getDeviceHistory(historyId);
```

### Parameters

| Name          | Type         | Description                                   | Notes                 |
| ------------- | ------------ | --------------------------------------------- | --------------------- |
| **historyId** | [**string**] | Unique string identifying the device history. | defaults to undefined |

### Return type

**DevicesDeviceInfoHistoryDetail**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details

| Status code | Description                 | Response headers |
| ----------- | --------------------------- | ---------------- |
| **200**     | Returns device history.     | -                |
| **404**     | Device or history not found | -                |
| **500**     | Internal Server Error       | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getDeviceInfoUploadUrl**

> DevicesDeviceInfoUploadResponse getDeviceInfoUploadUrl()

Generate a presigned URL to upload device_info for the selected device.

### Example

```typescript
import { DevicesApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new DevicesApi(configuration);

let deviceId: string; //Device ID (default to undefined)

const { status, data } = await apiInstance.getDeviceInfoUploadUrl(deviceId);
```

### Parameters

| Name         | Type         | Description | Notes                 |
| ------------ | ------------ | ----------- | --------------------- |
| **deviceId** | [**string**] | Device ID   | defaults to undefined |

### Return type

**DevicesDeviceInfoUploadResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details

| Status code | Description                      | Response headers |
| ----------- | -------------------------------- | ---------------- |
| **200**     | Device_info upload URL generated | -                |
| **401**     | Unauthorized                     | -                |
| **403**     | Not authorized                   | -                |
| **404**     | Not Found                        | -                |
| **500**     | Internal Server Error            | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listDeviceHistories**

> DevicesDeviceInfoHistoryListResponse listDeviceHistories()

List device history metadata. Optionally filter by device_id.

### Example

```typescript
import { DevicesApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new DevicesApi(configuration);

let deviceId: string; //Device identifier to filter histories. (optional) (default to undefined)
let from: string; //Inclusive lower bound of calibrated_at. (optional) (default to undefined)
let to: string; //Inclusive upper bound of calibrated_at. (optional) (default to undefined)
let limit: number; // (optional) (default to 100)
let offset: number; // (optional) (default to 0)

const { status, data } = await apiInstance.listDeviceHistories(deviceId, from, to, limit, offset);
```

### Parameters

| Name         | Type         | Description                             | Notes                            |
| ------------ | ------------ | --------------------------------------- | -------------------------------- |
| **deviceId** | [**string**] | Device identifier to filter histories.  | (optional) defaults to undefined |
| **from**     | [**string**] | Inclusive lower bound of calibrated_at. | (optional) defaults to undefined |
| **to**       | [**string**] | Inclusive upper bound of calibrated_at. | (optional) defaults to undefined |
| **limit**    | [**number**] |                                         | (optional) defaults to 100       |
| **offset**   | [**number**] |                                         | (optional) defaults to 0         |

### Return type

**DevicesDeviceInfoHistoryListResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details

| Status code | Description                      | Response headers |
| ----------- | -------------------------------- | ---------------- |
| **200**     | Returns device history metadata. | -                |
| **404**     | Device with device_id not found  | -                |
| **500**     | Internal Server Error            | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listDevices**

> Array<DevicesDeviceInfo> listDevices()

List available devices

### Example

```typescript
import { DevicesApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new DevicesApi(configuration);

const { status, data } = await apiInstance.listDevices();
```

### Parameters

This endpoint does not have any parameters.

### Return type

**Array<DevicesDeviceInfo>**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details

| Status code | Description                         | Response headers |
| ----------- | ----------------------------------- | ---------------- |
| **200**     | Returns a list of available devices | -                |
| **401**     | Unauthorized                        | -                |
| **403**     | Not authorized                      | -                |
| **500**     | Internal Server Error               | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **registerDevice**

> SuccessSuccessResponse registerDevice()

Register a new device to the system.

### Example

```typescript
import { DevicesApi, Configuration, DevicesDeviceBase } from './api';

const configuration = new Configuration();
const apiInstance = new DevicesApi(configuration);

let devicesDeviceBase: DevicesDeviceBase; //Device data (optional)

const { status, data } = await apiInstance.registerDevice(devicesDeviceBase);
```

### Parameters

| Name                  | Type                  | Description | Notes |
| --------------------- | --------------------- | ----------- | ----- |
| **devicesDeviceBase** | **DevicesDeviceBase** | Device data |       |

### Return type

**SuccessSuccessResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details

| Status code | Description           | Response headers |
| ----------- | --------------------- | ---------------- |
| **200**     | Device registered     | -                |
| **400**     | Bad Request           | -                |
| **401**     | Unauthorized          | -                |
| **403**     | Not authorized        | -                |
| **500**     | Internal Server Error | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateDeviceData**

> SuccessSuccessResponse updateDeviceData()

Update the properties of selected device.

### Example

```typescript
import { DevicesApi, Configuration, DevicesDevicePatch } from './api';

const configuration = new Configuration();
const apiInstance = new DevicesApi(configuration);

let deviceId: string; //Device ID (default to undefined)
let devicesDevicePatch: DevicesDevicePatch; //Updated device metadata (optional)

const { status, data } = await apiInstance.updateDeviceData(deviceId, devicesDevicePatch);
```

### Parameters

| Name                   | Type                   | Description             | Notes                 |
| ---------------------- | ---------------------- | ----------------------- | --------------------- |
| **devicesDevicePatch** | **DevicesDevicePatch** | Updated device metadata |                       |
| **deviceId**           | [**string**]           | Device ID               | defaults to undefined |

### Return type

**SuccessSuccessResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details

| Status code | Description                | Response headers |
| ----------- | -------------------------- | ---------------- |
| **200**     | Device\&#39;s data updated | -                |
| **400**     | Bad Request                | -                |
| **401**     | Unauthorized               | -                |
| **403**     | Not authorized             | -                |
| **404**     | Not Found                  | -                |
| **500**     | Internal Server Error      | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)
