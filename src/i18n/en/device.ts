export default {
  title: 'Devices',
    id: 'ID',
    status: 'Status',
    qubits: 'Number of Qubits',
    device_type: 'Type',
    pending_jobs: 'Pending Jobs',
    available_at: 'Available at',
    calibrated_at: 'Calibrated at',
    basis_gates: 'Basis Gates',
    instructions: 'Instructions',
    description: 'Description',
    detail: {
      title: 'Device Details',
    },
    form: {
      device_info: 'Device Information (JSON)',
      available_at: 'Available at (local time)',
      calibrated_at: 'Calibrated at (local time)',
      basis_gates: 'Basis Gates (separate with comma)',
      instructions: 'Supported Instructions (separate with comma)',
      warn: {
        required: 'Required field.',
        invalid_json: 'Invalid JSON format.',
        not_integer: 'Please enter an integer (> 0).',
      }
    },
    register: {
      title: 'Register Device',
      button: 'Register Device',
      success: 'Successfully registered the device',
      failure: 'Failed to register the device',
    },
    update: {
      title: 'Update Device',
      button: 'Edit',
      success: 'Successfully updated the device',
      failure: 'Failed to update the device',
      invalid_id: 'Device ID is Invalid. Please start over from the beginning.',
    },
    confirm: {
      back_buton: 'Edit',
      register_button: 'Register',
      success: 'Successfully updated the device',
      failure: 'Failed to update the device',
      invalid_id: 'Device ID is Invalid. Please start over from the beginning.',
    },
    delete: {
      button: 'Delete',
      confirm: 'Are you sure you want to delete {{device_id}}?\nThe device data will be lost.',
      success: 'Successfully deleted the device',
      failure: 'Failed tp delete the device',
    },
  };
  