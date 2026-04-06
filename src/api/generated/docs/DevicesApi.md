# DevicesApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**deleteDevice**](#deletedevice) | **DELETE** /devices/{device_id} | Delete a device|
|[**getDevice**](#getdevice) | **GET** /devices/{device_id} | Get specified device details|
|[**listDevices**](#listdevices) | **GET** /devices | List available devices|
|[**registerDevice**](#registerdevice) | **POST** /devices | Register a new device|
|[**updateDeviceData**](#updatedevicedata) | **PATCH** /devices/{device_id} | Update data of selected device|

# **deleteDevice**
> SuccessSuccessResponse deleteDevice()

Delete a device from the system.

### Example

```typescript
import {
    DevicesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DevicesApi(configuration);

let deviceId: string; //Device ID (default to undefined)

const { status, data } = await apiInstance.deleteDevice(
    deviceId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **deviceId** | [**string**] | Device ID | defaults to undefined|


### Return type

**SuccessSuccessResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Device deleted |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**403** | Not authorized |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getDevice**
> DevicesDeviceInfo getDevice()

get device

### Example

```typescript
import {
    DevicesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DevicesApi(configuration);

let deviceId: string; //Device identifier (default to undefined)

const { status, data } = await apiInstance.getDevice(
    deviceId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **deviceId** | [**string**] | Device identifier | defaults to undefined|


### Return type

**DevicesDeviceInfo**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | device response |  -  |
|**404** | Device with device_id not found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listDevices**
> Array<DevicesDeviceInfo> listDevices()

List available devices

### Example

```typescript
import {
    DevicesApi,
    Configuration
} from './api';

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
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Returns a list of available devices |  -  |
|**401** | Unauthorized |  -  |
|**403** | Not authorized |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **registerDevice**
> SuccessSuccessResponse registerDevice()

Register a new device to the system.

### Example

```typescript
import {
    DevicesApi,
    Configuration,
    DevicesDeviceBase
} from './api';

const configuration = new Configuration();
const apiInstance = new DevicesApi(configuration);

let devicesDeviceBase: DevicesDeviceBase; //Device data (optional)

const { status, data } = await apiInstance.registerDevice(
    devicesDeviceBase
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **devicesDeviceBase** | **DevicesDeviceBase**| Device data | |


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
|**200** | Device registered |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**403** | Not authorized |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateDeviceData**
> SuccessSuccessResponse updateDeviceData()

Update the properties of selected device.

### Example

```typescript
import {
    DevicesApi,
    Configuration,
    DevicesDeviceBase
} from './api';

const configuration = new Configuration();
const apiInstance = new DevicesApi(configuration);

let deviceId: string; //Device ID (default to undefined)
let devicesDeviceBase: DevicesDeviceBase; //New calibration data (optional)

const { status, data } = await apiInstance.updateDeviceData(
    deviceId,
    devicesDeviceBase
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **devicesDeviceBase** | **DevicesDeviceBase**| New calibration data | |
| **deviceId** | [**string**] | Device ID | defaults to undefined|


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
|**200** | Device\&#39;s data updated |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**403** | Not authorized |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

