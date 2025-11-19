# Kakeibo API Playground

AdonisJS (TypeScript) を使った **学習用の家計簿アプリ**。  
REST API で構築し、TypeScript を用いたバックエンド開発を試すためのリポジトリです。

## 🚀 クイックスタート

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

サーバーは `http://localhost:3333` で起動します。

## 🛠️ 技術スタック

- **フレームワーク**: AdonisJS v6
- **言語**: TypeScript
- **データベース**: PostgreSQL
- **ORM**: Lucid
- **認証**: @adonisjs/auth
- **バリデーション**: VineJS

## 📁 プロジェクト構造

```
app/
  ├── controllers/     # HTTPリクエストハンドラー
  ├── services/        # ビジネスロジック
  ├── repositories/    # データアクセス
  ├── models/          # データモデル
  ├── middleware/      # ミドルウェア
  └── validators/      # バリデーション
```

## 🎯 アーキテクチャ

レイヤー構造を採用：

```
Controller → Service → Repository → Model → Database
```

各層は単方向の依存関係を持ち、責務が明確に分離されています。

## 📝 開発ルール

プロジェクトの詳細なルールとコーディング規約は `.cursor/rules/` ディレクトリに定義されています：

- `00-overview.mdc` - プロジェクト概要
- `01-architecture.mdc` - アーキテクチャ
- `02-controller-layer.mdc` - Controller層の規約
- `03-service-layer.mdc` - Service層の規約
- `04-repository-layer.mdc` - Repository層の規約
- `05-model-layer.mdc` - Model層の規約
- `06-response-format.mdc` - レスポンスフォーマット
- `07-development.mdc` - 開発ガイド

これらのルールは、AIアシスタント（Cursor）が自動的に読み込み、適切なコード生成を行います。

## 💡 主要コマンド

```bash
# 開発サーバー起動（HMR有効）
npm run dev

# ビルド
npm run build

# テスト実行
npm test

# Lintチェック
npm run lint

# 型チェック
npm run typecheck

# マイグレーション実行
node ace migration:run
```

## 🎓 学習目標

- TypeScriptでのバックエンド開発
- REST API設計とベストプラクティス
- レイヤードアーキテクチャの理解
- ORM（Lucid）の使い方
- 認証・認可の実装
- データベース設計とマイグレーション
