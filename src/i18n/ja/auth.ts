export default {
  password_change: {
    first_change: '初回パスワード変更',
    title: 'パスワード変更',
    success: 'パスワードを変更しました。',
    fail: 'パスワードの変更に失敗しました。',
    mail: 'メールアドレス',
    current: '現在のパスワード',
    new: '新しいパスワード',
    rule: '下記の条件を満たすパスワードを入力してください。',
    rule1: 'アルファベットの小文字を含む',
    rule2: 'アルファベットの大文字を含む',
    rule3: '数字を含む',
    rule4: '記号を含む',
    rule5: '12文字以上である',
    submit: '送信',
    validation_warning: {
      user_name: 'ユーザー名を入力してください',
      mail: '正しいメールアドレスを入力してください',
      current: '現在のパスワードを入力してください',
      new: '新しいパスワードを入力してください',
      rule1: '小文字を含めてください。',
      rule2: '大文字を含めてください。',
      rule3: '数字を含めてください。',
      rule4: '特殊文字 (^$*.[]{}()?-"!@#%&/,><\':;|_~`+=)を含めてください。',
      rule5: '12文字以上で入力してください。',
    },
  },
  signin: {
    title: 'ログイン',
    auth_failed: '認証に失敗しました',
    require_password_change: 'パスワードを変更してください。',
    require_mfa_setup: 'MFAを設定してください',
    mail: 'メールアドレス',
    password: 'パスワード',
    submit: 'サインイン',
    warn: {
      user_name: 'ユーザー名を入力してください',
      mail: '正しいメールアドレスを入力してください',
      password: 'パスワードを入力してください',
    },
  },
  signout: {
    signout_failed: 'ログアウトに失敗しました',
  },
  mfa: {
    confirm: {
      title: 'MFA 確認',
      placeholder: 'TOTP コードを入力してください',
      button: '確認',
      warn: {
        required: 'TOTP コードを入力してください',
      },
      alert: {
        failure: 'TOTP コードの認証に失敗しました',
      },
    },
    setup: {
      title: 'MFA セットアップ',
      placeholder: 'TOTP コードを入力してください',
      warn: {
        required: 'TOTP コードを入力してください',
      },
      alert: {
        success: 'MFAデバイスのセットアップが完了しました',
        failure: 'MFAデバイスのセットアップに失敗しました',
      },
      button: '送信',
    },
    error_alert: {
      failed_get_setup_info: 'セットアップ情報の取得に失敗しました',
      error_totp_code: 'TOTPの認証に失敗しました',
    },
  },
};
