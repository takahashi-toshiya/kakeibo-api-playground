# API仕様書

このファイルには以下の情報を記載します：
- エンドポイント一覧（メソッド、パス）
- リクエストパラメータ
- レスポンス形式
- エラーレスポンス
- 認証が必要かどうか

## エンドポイント一覧

### Auth

- `POST /v1/auth/tokens` … ログイン（Access/Refresh 発行）
- `POST /v1/auth/tokens/refresh` … リフレッシュ（新Access発行）
- `DELETE /v1/auth/tokens/{refreshTokenId}` … ログアウト（失効）

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

