# データベース設計

## テーブル一覧

### Users（ユーザー）

**テーブル名**: `users` (既存)

| カラム名   | 型          | 制約               | 説明                     |
| ---------- | ----------- | ------------------ | ------------------------ |
| id         | bigint      | PK, AUTO_INCREMENT | ユーザーID               |
| email      | string(255) | UNIQUE, NOT NULL   | メールアドレス           |
| password   | string(255) | NOT NULL           | パスワード（ハッシュ化） |
| full_name  | string(100) | NULL               | 氏名                     |
| created_at | timestamp   | NOT NULL           | 作成日時                 |
| updated_at | timestamp   | NULL               | 更新日時                 |

**インデックス**:

- PRIMARY KEY: `id`
- UNIQUE INDEX: `email`

---

### Categories（カテゴリ）

**テーブル名**: `categories`

| カラム名   | 型                        | 制約               | 説明         |
| ---------- | ------------------------- | ------------------ | ------------ |
| id         | bigint                    | PK, AUTO_INCREMENT | カテゴリID   |
| name       | string(100)               | NOT NULL           | カテゴリ名   |
| type       | enum('income', 'expense') | NOT NULL           | 収入/支出    |
| color      | string(7)                 | NULL               | カラーコード |
| icon       | string(50)                | NULL               | アイコン名   |
| created_at | timestamp                 | NOT NULL           | 作成日時     |
| updated_at | timestamp                 | NULL               | 更新日時     |

**インデックス**:

- PRIMARY KEY: `id`

---

### Records（記録）

**テーブル名**: `records`

| カラム名    | 型                        | 制約                        | 説明       |
| ----------- | ------------------------- | --------------------------- | ---------- |
| id          | bigint                    | PK, AUTO_INCREMENT          | 記録ID     |
| user_id     | bigint                    | NOT NULL, FK(users.id)      | ユーザーID |
| category_id | bigint                    | NOT NULL, FK(categories.id) | カテゴリID |
| amount      | decimal(10,2)             | NOT NULL                    | 金額       |
| type        | enum('income', 'expense') | NOT NULL                    | 収入/支出  |
| date        | date                      | NOT NULL                    | 取引日     |
| memo        | text                      | NULL                        | メモ       |
| created_at  | timestamp                 | NOT NULL                    | 作成日時   |
| updated_at  | timestamp                 | NULL                        | 更新日時   |

**インデックス**:

- PRIMARY KEY: `id`
- INDEX: `user_id`
- INDEX: `category_id`
- INDEX: `date`
- COMPOSITE INDEX: `(user_id, date)` （月次レポート用）

---

## リレーションシップ

```
Users 1:N Records
  └─ user_id (records.user_id → users.id)

Categories 1:N Records
  └─ category_id (records.category_id → categories.id)
```

**注意**:

- Categories は全ユーザー共通のカテゴリ（システムカテゴリ）
- Records の type と Categories の type は一致する
- 月次レポートは Records の date カラムで集計
