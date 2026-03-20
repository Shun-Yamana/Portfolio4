# Portfolio4 Infrastructure (AWS CDK)

AWS CDK で構築した Portfolio4 プロジェクトのインフラストラクチャです。

## Project Structure

```
infrastructure/
├── app.py                      # CDK アプリケーションエントリポイント
├── cdk.json                    # CDK 設定ファイル
├── requirements.txt            # Python 依存パッケージ
├── requirements-dev.txt        # 開発用依存パッケージ
├── infrastructure/             # CDK スタック定義
│   ├── __init__.py
│   └── infrastructure_stack.py # メインスタック定義
└── tests/                      # テストファイル（今後使用可）
    ├── __init__.py
    └── unit/
```

## Setup

### 1. 仮想環境を有効化

Windows:
```
.venv\Scripts\Activate.ps1
```

Mac/Linux:
```
source .venv/bin/activate
```

### 2. 依存パッケージをインストール

```
pip install -r requirements.txt
```

## Deployment

### ブートストラップ（初回のみ）

```
npx cdk bootstrap aws://ACCOUNT_ID/REGION
```

### デプロイ

```
npx cdk deploy Portfolio4Stack --require-approval never
```

## Infrastructure

デプロイされるリソース：
- **DynamoDB**: Inventory, Products テーブル
- **Lambda**: バックエンド API 関数
- **API Gateway**: REST API エンドポイント
- **S3**: フロントエンド静的ホスティング
- **CloudFront**: CDN + ルーティング

## Cleanup

スタック削除：
```
npx cdk destroy
```
% .venv\Scripts\activate.bat
```

Once the virtualenv is activated, you can install the required dependencies.

```
$ pip install -r requirements.txt
```

At this point you can now synthesize the CloudFormation template for this code.

```
$ cdk synth
```

To add additional dependencies, for example other CDK libraries, just add
them to your `requirements.txt` file and rerun the `python -m pip install -r requirements.txt`
command.

## Useful commands

 * `cdk ls`          list all stacks in the app
 * `cdk synth`       emits the synthesized CloudFormation template
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk docs`        open CDK documentation

Enjoy!
