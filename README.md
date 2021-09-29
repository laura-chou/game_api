# 遊戲 Api
## 搶救荷包大作戰
### RescueMoney Collection
#### 資料欄位
+ `player` 玩家名稱
+ `money` 金錢

### 查詢
#### 查詢所有資料
+ 請求方式為 **GET**
+ 路徑為 `/RescueMoney`
+ 回傳內容包含
    - 狀態碼
    - 是否成功
    - 訊息
    - 資料庫資料

#### 資料格式為 JSON
  ```js
  {
    "success": true,
    "message": "所有資料",
    "rescuemoney": [
      {
        "player": "player_name",
        "money": 0
      }
    ]
  }
  ```
#### 查詢玩家的金錢及排名
+ 請求方式為 **GET**
+ 路徑為 `/RescueMoney/:player`
+ 回傳內容包含
    - 狀態碼
    - 是否成功
    - 訊息
    - 資料庫資料

#### 資料格式為 JSON
  ```js
  {
    "success": true,
    "message": "玩家資料",
    "rescuemoney": [
      {
        "player": "player_name",
        "money": 0,
        "rank": 1
      }
    ]
  }
  ```
#### 檢查玩家是否為前五名
+ 請求方式為 **GET**
+ 路徑為 `/RescueMoney/IsTopFive/:player`
+ 回傳內容包含
    - 狀態碼
    - 是否成功
    - 訊息
#### 資料格式為 JSON
  ```js
  {
    "success": true,
    "message": true
  }
  ```
### 新增
#### 新增玩家名稱及金錢
+ 請求方式為 **POST**
+ 路徑為 `/RescueMoney`
+ 只接受 `application/json` 格式
  ```js
  {
    "player": "player_name",
    "money": 0
  }
  ```
+ 回傳內容包含
    - 狀態碼
    - 是否成功
    - 訊息
  ```js
  {
    "success": true,
    "message": "新增成功",
  }
  ```
---
## Bonus Collection
### 資料欄位
+ `jackpot` 獎金
### 查詢
#### 查詢所有資料
+ 請求方式為 **GET**
+ 路徑為 `/Bonus`
+ 回傳內容包含
    - 狀態碼
    - 是否成功
    - 訊息
    - 資料庫資料
#### 資料格式為 JSON
  ```js
  {
    "success": true,
    "message": "所有資料",
    "result": [
      {
        "jackpot": 7700,
        "amount": 1
      }
    ]
  }
  ```
### 修改
#### 修改獎金
+ 請求方式為 **PATCH**
+ 路徑為 `/Bonus`
+ 只接受 `application/json` 格式
  ```js
  {
    "jackpot": 10000
  }
  ```
+ 回傳內容包含
    - 狀態碼
    - 是否成功
    - 訊息
#### 資料格式為 JSON
  ```js
  {
    "success": true,
    "message": "修改成功"
  }
  ```