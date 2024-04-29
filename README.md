# Toast Adapter for Data Plus

This repository works with Toast's [_Order_](https://doc.toasttab.com/openapi/orders/operation/ordersBulkGet/) and [_Configuration_](https://doc.toasttab.com/openapi/configuration/overview/) APIs to produce an array or CSV file for importing into the [DPHS](https://www.dphs.com/) ERP system.

## Setup

1. Install Packages

```shell
$ npm install
```

2. Create Configuration Files

```shell
$ touch credentials.json
$ touch properties.json
```

3. Add Credentials - `credentials.json`

```json title="credentials.json"
{
  "hostname": "xx.xxxx.com",
  "clientID": "xxxx",
  "clientSecret": "xxxx"
}
```

4. Map Property GUIDs - `properties.json`

```js
{"000": "xxxxx"}
```

5. Run Program

```shell
$ npm start [property] [date]
$ npm start 000 2024-04-28
```
