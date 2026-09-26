exports.ok = (res, message, data, status = 200) =>
    res.status(status).json({ success: true, message, data: data ?? null });

exports.fail = (res, status, message, data = null) =>
    res.status(status).json({ success: false, message, data });

exports.safeError = (res, err, fallback = 'Something went wrong') => {
    console.error(err);
    return res.status(500).json({ success: false, message: fallback, data: null });
};
