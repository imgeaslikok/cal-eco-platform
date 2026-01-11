const WalletModel = require('../models/wallet.model');
const {
  successResponse,
  errorResponse,
  validationErrorResponse
} = require('../utils/response');

exports.addWallet = async (req, res) => {
  try {
    const { address, chain, is_primary } = req.body;

    if (!address) {
      const { response, statusCode } =
        validationErrorResponse('ADDRESS_REQUIRED');
      return res.status(statusCode).json(response);
    }

    const result = await WalletModel.addWallet({
      user_id: req.user_id,
      address,
      chain: chain || 'bsc',
      is_primary: !!is_primary
    });

    const { response, statusCode } =
      successResponse({ id: result.insertId }, 'Success', 201);

    return res.status(statusCode).json(response);
  } catch (_e) {
    const { response, statusCode } =
      errorResponse('INTERNAL_SERVER_ERROR', 500);
    return res.status(statusCode).json(response);
  }
};

exports.listWallets = async (req, res) => {
  try {
    const rows = await WalletModel.listWallets({ user_id: req.user_id });

    const { response, statusCode } =
      successResponse(rows, 'Success', 200);

    return res.status(statusCode).json(response);
  } catch (_e) {
    const { response, statusCode } =
      errorResponse('INTERNAL_SERVER_ERROR', 500);
    return res.status(statusCode).json(response);
  }
};

exports.removeWallet = async (req, res) => {
  try {
    const { id } = req.params;

    await WalletModel.removeWallet({ user_id: req.user_id, id });

    // 204 No Content must not include a response body
    return res.status(204).send();
  } catch (_e) {
    const { response, statusCode } =
      errorResponse('INTERNAL_SERVER_ERROR', 500);
    return res.status(statusCode).json(response);
  }
};
