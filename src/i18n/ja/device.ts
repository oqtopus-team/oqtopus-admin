export default {
    title: 'デバイス',
    id: 'ID',
    status: 'ステータス',
    qubits: '量子ビット数',
    device_type: 'タイプ',
    pending_jobs: '保留中のジョブ',
    available_at: '利用可能日時',
    calibrated_at: '最終キャリブレーション日時',
    basis_gates: '基本量子ゲート',
    instructions: '非ゲート命令',
    description: '説明',
    detail: {
      title: 'デバイス詳細',
    },
    form: {
      device_info: 'デバイス情報 (JSON)',
      available_at: '利用可能日時 (local time)',
      calibrated_at: '最終キャリブレーション日時 (local time)',
      basis_gates: '基本量子ゲート (カンマ区切り)',
      instructions: '非ゲート命令 (カンマ区切り)',
      warn: {
        required: '必須項目です',
        invalid_json: '不正なJSONフォーマットです',
        not_integer: '0より大きい整数を入力してください',
      }
    },
    register: {
      title: 'デバイス登録',
      button: 'デバイス登録',
      success: 'デバイスの登録に成功しました',
      failure: 'デバイスの登録に失敗しました'
    },
    update: {
      title: 'デバイス更新',
      button: 'Edit',
      success: 'デバイスの更新に成功しました',
      failure: 'デバイスの更新に失敗しました',
      invalid_id: 'Device ID is Invalid. Please start over from the beginning.',
    },
    confirm: {
      back_buton: 'Edit',
      register_button: 'Register',
      success: 'デバイスの更新に成功しました',
      failure: 'デバイスの更新に失敗しました',
      invalid_id: 'Device ID is Invalid. Please start over from the beginning.',
    },
    delete: {
      button: 'Delete',
      confirm: "{{device_id}}のデバイス情報は削除されます。よろしいですか？",
      success: 'デバイスの削除に成功しました',
      failure: 'デバイスの削除に失敗しました',
    },
  };
  