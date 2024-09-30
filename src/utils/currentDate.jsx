export const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const dateToISOString = (date) => {
    return new Date(date).toISOString();
};

export const ISOStringToDate = (ISOStringDate) => {
    if (!ISOStringDate) return ''; // Kiểm tra nếu giá trị null hoặc undefined thì trả về chuỗi rỗng

    let date = new Date(ISOStringDate);
    if (isNaN(date.getTime())) return ''; // Kiểm tra nếu giá trị không hợp lệ, trả về chuỗi rỗng

    // Format lại ngày tháng thành YYYY-MM-DD
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(
        2,
        '0',
    )}`;
};
