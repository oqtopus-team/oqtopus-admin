export default {
  password_change: {
    first_change: 'Initial password change',
    title: 'Password change',
    success: 'Successfully changed password',
    fail: 'Failed to change password',
    mail: 'Mail address',
    current: 'Current password',
    new: 'New password',
    rule: 'Input the new password according to the following rules',
    rule1: 'Include lowercase alphabet',
    rule2: 'Include uppercase alphabet',
    rule3: 'Include numbers',
    rule4: 'Include special characters.',
    rule5: '12 characters or more',
    submit: 'Submit',
    validation_warning: {
      user_name: 'Please enter your user name',
      mail: 'Please enter a valid email address',
      current: 'Please enter your current password',
      new: 'Please enter a new password',
      rule1: 'Include lowercase alphabet',
      rule2: 'Include uppercase alphabet',
      rule3: 'Include numbers',
      rule4: 'Include special characters.',
      rule5: 'Enter 12 characters or more',
    },
  },
  signin: {
    title: 'Signin',
    auth_failed: 'Authentication failed',
    require_password_change: 'Change your password',
    require_mfa_setup: 'Please set up MFA',
    mail: 'Mail address',
    password: 'Password',
    submit: 'Signin',
    warn: {
      user_name: 'Please enter your user name',
      mail: 'Please enter a valid email address',
      password: 'Please enter your password',
    },
    signout: {
      signout_failed: 'Sign out failed',
    },
  },
  mfa: {
    confirm: {
      title: 'MFA confirmation',
      placeholder: 'Enter TOTP code',
      button: 'Confirm',
      warn: {
        required: 'Please enter TOTP code',
      },
      alert: {
        failure: 'Failed to authenticate TOTP',
      },
    },
    setup: {
      title: 'MFA Setup',
      placeholder: 'Enter TOTP code',
      warn: {
        required: 'Please enter TOTP code',
      },
      alert: {
        success: 'MFA device setup is complete',
        failure: 'Failed to set up MFA device',
      },
      button: 'Submit',
    },
    error_alert: {
      failed_get_setup_info: 'Failed to get setup information',
      error_totp_code: 'Failed to authenticate TOTP',
    },
  },
};
