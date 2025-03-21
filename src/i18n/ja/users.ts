export default {
  title: 'ユーザー',
  mail: 'メールアドレス',
  group_id: 'グループID',
  name: '氏名',
  organization: '所属組織',
  status: {
    name: 'ステータス',
    approved: '承認済み',
    unapproved: '未承認',
    suspended: '停止中',
  },
  list: {
    header: 'ユーザー検索',
    operations: '操作',
    search_button: '検索',
    operation: {
      delete: '削除',
      delete_success: '{{user}}を削除しました',
      delete_confirm: '{{user}}を削除します。よろしいですか？',
      suspend: '停止',
      unsuspend: '停止解除',
      suspend_confirm: '{{user}}の利用を停止します。よろしいですか？',
      unsuspend_confirm: '{{user}}の利用停止を解除します。よろしいですか？',
    }
  },
  white_list: {
    title: 'ホワイトリスト',
    header: 'ホワイトリストユーザー検索',
    signup: 'サインアップ',
    is_signup_completed: {
      true: '済',
      false: '未',
    },
    operations: '操作',
    search_button: '検索',
    register_button: '新規登録',
    operation: {
      delete: '削除',
      delete_success: '{{user}}を削除しました',
      delete_failure: '{{user}}の削除に失敗しました',
      delete_confirm: '{{user}}を削除します。よろしいですか？',
    },
    register: {
      title: 'ホワイトリスト登録',
      header: 'ホワイトリスト新規登録',
      button: {
        add: '追加',
        register: '登録',
        clear: 'クリア',
      },
      register_confirm: 'ホワイトリストユーザーを登録します。よろしいですか？',
      register_success: 'ホワイトリストユーザーの登録に成功しました',
      warn: {
        group_id: 'グループIDを入力してください',
        group_id_length: '100文字以下で入力してください',
        email: 'メールアドレスを入力してください',
        email_invalid: 'メールアドレスの形式が不正です',
        email_length: '100文字以下で入力してください',
        email_duplicated: 'メールアドレスが重複しています。',
        username_length: '100文字以下で入力してください。',
        organization_length: '100文字以下で入力してください。',
        no_data: '登録するデータがありません。'
      },
      failure: '登録処理が失敗しました。\n',
      clear_confirm: '入力内容をクリアします。よろしいですか？',
      excel: {
        title: 'ホワイトリストExcelインポート',
        button: {
          import: 'Excelインポート',
          template: 'テンプレートExcel',
          register: '登録',
          cancel: 'キャンセル',
        },
        header: {
          group_id: 'グループID(必須)',
          mail: 'メールアドレス(必須)',
          name: '氏名',
          organization: '所属組織',
        },
        notice: '※一度に登録できるユーザーは最大100名です。',
        error: {
          load: 'ファイルの読み込みに失敗しました',
          register: '登録処理に失敗しました: ',
          system_error: 'システムエラーが発生しました。管理者までお問い合わせください。',
          invalid_spreadsheet: '不正なExcelシートです。テンプレートExcelをお使いください。',
          invalid_header: 'Excelヘッダーが不正です。テンプレートExcelをお使いください。',
          no_data: '登録するデータがありません。2行目以降に情報を登録してください。',
          exceeded_records: '一度に登録できるユーザーは100人までです。',
          required_item: 'グループIDとメールアドレスは必須です。',
          invalid_group_id_length: 'グループIDは100文字以下で入力してください。',
          invalid_email: '不正なメールアドレスが含まれています。',
          invalid_email_length: 'メールアドレスは100文字以下で入力してください。',
          invalid_username_length: '氏名は100文字以下で入力してください。',
          invalid_organization_length: '所属組織は100文字以下で入力してください。',
          duplicated_email: 'メールアドレスが重複しています。',
        }
      }
    }
  },
};
  