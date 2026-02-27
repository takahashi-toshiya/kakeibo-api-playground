# API仕様書

このファイルには以下の情報を記載します：

- エンドポイント一覧（メソッド、パス）
- リクエストパラメータ
- レスポンス形式
- エラーレスポンス
- 認証が必要かどうか

## 共通仕様

### アプリケーション想定

このAPIは**スマホアプリ（iOS/Android）**を前提として設計されています。

### 認証方式

- **認証方式**: Access Token認証
- **トークン形式**: Bearer Token
- **ヘッダー**: `Authorization: Bearer {access_token}`
- **トークン管理**: データベースベース（`auth_access_tokens`テーブル）
- **有効期限**: 長めに設定（例: 30日）
- **注意**: Refresh Tokenは使用しません（スマホアプリはセキュアストレージに保存可能なため）

### ベースURL

```
http://localhost:3333/v1
```

### レスポンス形式

全てのレスポンスは以下の形式を使用：

```json
{
  "success": true|false,
  "data": {},
  "message": "メッセージ（オプション）",
  "errors": {} // バリデーションエラー時のみ
}
```

### エラーレスポンス

| HTTPステータス            | 説明                   |
| ------------------------- | ---------------------- |
| 400 Bad Request           | バリデーションエラー   |
| 401 Unauthorized          | 認証エラー             |
| 403 Forbidden             | 権限エラー             |
| 404 Not Found             | リソースが見つからない |
| 500 Internal Server Error | サーバーエラー         |

---

## エンドポイント一覧

### Auth

- `POST /v1/auth/tokens` … ログイン（Access Token発行）
- `DELETE /v1/auth/tokens/{tokenId}` … ログアウト（Access Token失効）

### Users

- `POST /v1/users` … サインアップ
- `GET /v1/users/me` … 自分のプロフィール取得
- `PATCH /v1/users/me` … 自分のプロフィール更新（任意）

### Categories

- `GET /v1/categories` … 一覧
- `POST /v1/categories` … 作成
- `GET /v1/categories/{id}` … 参照
- `PATCH /v1/categories/{id}` … 更新
- `DELETE /v1/categories/{id}` … 削除

### Records

- `GET /v1/records` … 検索/一覧
- `POST /v1/records` … 作成
- `GET /v1/records/{id}` … 参照
- `PATCH /v1/records/{id}` … 更新
- `DELETE /v1/records/{id}` … 削除

### Reports（読み取り専用・動的集計）

- `GET /v1/reports/{yyyy-mm}` … 月次レポート（合計/カテゴリ別内訳）

---

## エンドポイント詳細

### Auth

#### ログイン

- **エンドポイント**: `POST /v1/auth/tokens`
- **認証**: 不要
- **リクエスト**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **バリデーション**:
  - `email`: 必須、メールアドレス形式
  - `password`: 必須、文字列
- **成功レスポンス** (200 OK):
  ```json
  {
    "success": true,
    "message": "ログインに成功しました",
    "data": {
      "type": "bearer",
      "token": "access_token_value",
      "expires_at": "2024-02-01T00:00:00.000Z"
    }
  }
  ```
- **エラーレスポンス** (401 Unauthorized):
  ```json
  {
    "success": false,
    "message": "認証に失敗しました"
  }
  ```
- **エラーレスポンス** (400 Bad Request):
  ```json
  {
    "success": false,
    "message": "バリデーションエラー",
    "errors": {
      "email": ["メールアドレスは必須です"],
      "password": ["パスワードは必須です"]
    }
  }
  ```

#### ログアウト

- **エンドポイント**: `DELETE /v1/auth/tokens/{tokenId}`
- **認証**: 必要
- **パスパラメータ**:
  - `tokenId`: トークンID（ログイン時に発行されたトークンのID）
- **成功レスポンス** (200 OK):
  ```json
  {
    "success": true,
    "message": "ログアウトしました"
  }
  ```
- **エラーレスポンス** (404 Not Found):
  ```json
  {
    "success": false,
    "message": "トークンが見つかりません"
  }
  ```

### Users

#### サインアップ

- **エンドポイント**: `POST /v1/users`
- **認証**: 不要
- **概要**: 新規ユーザーを作成します。作成後はログインAPIでトークンを取得します。
- **リクエスト**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "full_name": "山田 太郎"
  }
  ```
- **バリデーション**:
  - `email`: 必須、メールアドレス形式、一意
  - `password`: 必須、文字列（詳細な強度チェックは今後拡張）
  - `full_name`: 任意、文字列（最大100文字）
- **成功レスポンス** (201 Created):
  ```json
  {
    "success": true,
    "message": "ユーザーを作成しました",
    "data": {
      "id": 1,
      "email": "user@example.com",
      "full_name": "山田 太郎",
      "created_at": "2024-02-01T00:00:00.000Z",
      "updated_at": "2024-02-01T00:00:00.000Z"
    }
  }
  ```
- **エラーレスポンス** (400 Bad Request 例: バリデーションエラー):
  ```json
  {
    "success": false,
    "message": "バリデーションエラー",
    "errors": {
      "email": ["メールアドレスは必須です"],
      "password": ["パスワードは必須です"]
    }
  }
  ```
- **エラーレスポンス** (400 Bad Request 例: メールアドレス重複):
  ```json
  {
    "success": false,
    "message": "このメールアドレスは既に登録されています"
  }
  ```

#### 自分のプロフィール取得

- **エンドポイント**: `GET /v1/users/me`
- **認証**: 必要
- **概要**: ログイン中のユーザー自身の情報を返します。
- **成功レスポンス** (200 OK):
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "email": "user@example.com",
      "full_name": "山田 太郎",
      "created_at": "2024-02-01T00:00:00.000Z",
      "updated_at": "2024-02-01T00:00:00.000Z"
    }
  }
  ```
- **エラーレスポンス** (401 Unauthorized):
  ```json
  {
    "success": false,
    "message": "認証が必要です"
  }
  ```

#### 自分のプロフィール更新

- **エンドポイント**: `PATCH /v1/users/me`
- **認証**: 必要
- **概要**: ログイン中ユーザー自身のプロフィールを部分更新します。
- **リクエスト**:
  ```json
  {
    "full_name": "山田 花子"
  }
  ```
- **バリデーション**:
  - `full_name`: 任意、文字列（最大100文字）
- **成功レスポンス** (200 OK):
  ```json
  {
    "success": true,
    "message": "プロフィールを更新しました",
    "data": {
      "id": 1,
      "email": "user@example.com",
      "full_name": "山田 花子",
      "created_at": "2024-02-01T00:00:00.000Z",
      "updated_at": "2024-02-02T00:00:00.000Z"
    }
  }
  ```

### Categories

#### カテゴリ一覧取得

- **エンドポイント**: `GET /v1/categories`
- **認証**: 必要
- **概要**: 利用可能なカテゴリ一覧を返します。収入/支出でフィルタ可能です。
- **クエリパラメータ**（任意）:
  - `type`: `income` または `expense`（指定時はその種別のみ）
- **成功レスポンス** (200 OK):
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "給料",
        "type": "income",
        "color": "#FF9900",
        "icon": "salary",
        "created_at": "2024-02-01T00:00:00.000Z",
        "updated_at": "2024-02-01T00:00:00.000Z"
      }
    ]
  }
  ```

#### カテゴリ作成

- **エンドポイント**: `POST /v1/categories`
- **認証**: 必要
- **概要**: 新しいカテゴリを作成します。（将来的にロール/権限で制御する想定）
- **リクエスト**:
  ```json
  {
    "name": "外食",
    "type": "expense",
    "color": "#FF6600",
    "icon": "restaurant"
  }
  ```
- **バリデーション**:
  - `name`: 必須、文字列（最大100文字）
  - `type`: 必須、`income` or `expense`
  - `color`: 任意、`#RRGGBB` 形式の文字列
  - `icon`: 任意、文字列（最大50文字）
- **成功レスポンス** (201 Created):
  ```json
  {
    "success": true,
    "message": "カテゴリを作成しました",
    "data": {
      "id": 10,
      "name": "外食",
      "type": "expense",
      "color": "#FF6600",
      "icon": "restaurant",
      "created_at": "2024-02-01T00:00:00.000Z",
      "updated_at": "2024-02-01T00:00:00.000Z"
    }
  }
  ```

#### カテゴリ取得

- **エンドポイント**: `GET /v1/categories/{id}`
- **認証**: 必要
- **パスパラメータ**:
  - `id`: カテゴリID
- **成功レスポンス** (200 OK):
  ```json
  {
    "success": true,
    "data": {
      "id": 10,
      "name": "外食",
      "type": "expense",
      "color": "#FF6600",
      "icon": "restaurant",
      "created_at": "2024-02-01T00:00:00.000Z",
      "updated_at": "2024-02-01T00:00:00.000Z"
    }
  }
  ```
- **エラーレスポンス** (404 Not Found):
  ```json
  {
    "success": false,
    "message": "カテゴリが見つかりません"
  }
  ```

#### カテゴリ更新

- **エンドポイント**: `PATCH /v1/categories/{id}`
- **認証**: 必要
- **パスパラメータ**:
  - `id`: カテゴリID
- **リクエスト**（一部のみ更新可能）:
  ```json
  {
    "name": "外食・交際費",
    "color": "#FF3300"
  }
  ```
- **バリデーション**:
  - `name`: 任意、文字列（最大100文字）
  - `type`: 任意、`income` or `expense`
  - `color`: 任意、`#RRGGBB`
  - `icon`: 任意、文字列（最大50文字）
- **成功レスポンス** (200 OK):
  ```json
  {
    "success": true,
    "message": "カテゴリを更新しました",
    "data": {
      "id": 10,
      "name": "外食・交際費",
      "type": "expense",
      "color": "#FF3300",
      "icon": "restaurant",
      "created_at": "2024-02-01T00:00:00.000Z",
      "updated_at": "2024-02-02T00:00:00.000Z"
    }
  }
  ```

#### カテゴリ削除

- **エンドポイント**: `DELETE /v1/categories/{id}`
- **認証**: 必要
- **パスパラメータ**:
  - `id`: カテゴリID
- **成功レスポンス** (200 OK):
  ```json
  {
    "success": true,
    "message": "カテゴリを削除しました"
  }
  ```

### Records

#### 記録一覧取得 / 検索

- **エンドポイント**: `GET /v1/records`
- **認証**: 必要
- **概要**: ログインユーザーの記録一覧を返します。期間・カテゴリ・種別でフィルタ可能です。
- **クエリパラメータ**（全て任意）:
  - `from`: 開始日（`YYYY-MM-DD`）
  - `to`: 終了日（`YYYY-MM-DD`）
  - `category_id`: カテゴリID
  - `type`: `income` or `expense`
- **成功レスポンス** (200 OK):
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "user_id": 1,
        "category_id": 10,
        "amount": 1200.0,
        "type": "expense",
        "date": "2024-02-01",
        "memo": "ランチ",
        "created_at": "2024-02-01T00:00:00.000Z",
        "updated_at": "2024-02-01T00:00:00.000Z"
      }
    ]
  }
  ```

#### 記録作成

- **エンドポイント**: `POST /v1/records`
- **認証**: 必要
- **概要**: 新しい記録を作成します。`user_id` は認証情報から自動的に設定されます。
- **リクエスト**:
  ```json
  {
    "category_id": 10,
    "amount": 1200.0,
    "type": "expense",
    "date": "2024-02-01",
    "memo": "ランチ"
  }
  ```
- **バリデーション**:
  - `category_id`: 必須、既存カテゴリID
  - `amount`: 必須、0より大きい数値（小数点2桁まで）
  - `type`: 必須、`income` or `expense`（カテゴリの `type` と一致させる）
  - `date`: 必須、`YYYY-MM-DD` 形式
  - `memo`: 任意、文字列
- **成功レスポンス** (201 Created):
  ```json
  {
    "success": true,
    "message": "記録を作成しました",
    "data": {
      "id": 1,
      "user_id": 1,
      "category_id": 10,
      "amount": 1200.0,
      "type": "expense",
      "date": "2024-02-01",
      "memo": "ランチ",
      "created_at": "2024-02-01T00:00:00.000Z",
      "updated_at": "2024-02-01T00:00:00.000Z"
    }
  }
  ```

#### 記録取得

- **エンドポイント**: `GET /v1/records/{id}`
- **認証**: 必要
- **パスパラメータ**:
  - `id`: 記録ID（ログインユーザー所有のレコードのみ取得可能）
- **成功レスポンス** (200 OK):
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "user_id": 1,
      "category_id": 10,
      "amount": 1200.0,
      "type": "expense",
      "date": "2024-02-01",
      "memo": "ランチ",
      "created_at": "2024-02-01T00:00:00.000Z",
      "updated_at": "2024-02-01T00:00:00.000Z"
    }
  }
  ```
- **エラーレスポンス** (404 Not Found):
  ```json
  {
    "success": false,
    "message": "記録が見つかりません"
  }
  ```

#### 記録更新

- **エンドポイント**: `PATCH /v1/records/{id}`
- **認証**: 必要
- **パスパラメータ**:
  - `id`: 記録ID
- **リクエスト**（部分更新）:
  ```json
  {
    "category_id": 11,
    "amount": 1500.0,
    "memo": "ランチ（同僚と）"
  }
  ```
- **バリデーション**:
  - `category_id`: 任意、既存カテゴリID
  - `amount`: 任意、0より大きい数値
  - `type`: 任意、`income` or `expense`
  - `date`: 任意、`YYYY-MM-DD`
  - `memo`: 任意、文字列
- **成功レスポンス** (200 OK):
  ```json
  {
    "success": true,
    "message": "記録を更新しました",
    "data": {
      "id": 1,
      "user_id": 1,
      "category_id": 11,
      "amount": 1500.0,
      "type": "expense",
      "date": "2024-02-01",
      "memo": "ランチ（同僚と）",
      "created_at": "2024-02-01T00:00:00.000Z",
      "updated_at": "2024-02-02T00:00:00.000Z"
    }
  }
  ```

#### 記録削除

- **エンドポイント**: `DELETE /v1/records/{id}`
- **認証**: 必要
- **パスパラメータ**:
  - `id`: 記録ID
- **成功レスポンス** (200 OK):
  ```json
  {
    "success": true,
    "message": "記録を削除しました"
  }
  ```

### Reports

#### 月次レポート取得

- **エンドポイント**: `GET /v1/reports/{yyyy-mm}`
- **認証**: 必要
- **概要**: 指定月の収入/支出合計およびカテゴリ別内訳を返します。対象はログインユーザーの記録のみです。
- **パスパラメータ**:
  - `yyyy-mm`: 対象年月（例: `2024-02`）
- **成功レスポンス** (200 OK):
  ```json
  {
    "success": true,
    "data": {
      "month": "2024-02",
      "total_income": 300000.0,
      "total_expense": 150000.0,
      "balance": 150000.0,
      "breakdown_by_category": [
        {
          "category_id": 10,
          "category_name": "外食",
          "type": "expense",
          "amount": 20000.0
        },
        {
          "category_id": 1,
          "category_name": "給料",
          "type": "income",
          "amount": 300000.0
        }
      ]
    }
  }
  ```
- **エラーレスポンス** (400 Bad Request 例: フォーマット不正):
  ```json
  {
    "success": false,
    "message": "年月の形式が不正です。YYYY-MM 形式で指定してください。"
  }
  ```
