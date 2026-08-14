import api from "../../api/axios";


// =========================
// رفع روشتة
// =========================

export const uploadPrescription = async (formData) => {

    const response = await api.post(
        "/prescriptions/prescriptions/",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;

};



// =========================
// تحليل الروشتة AI
// =========================

export const analyzePrescription = async (id) => {

    const response = await api.post(
        `/prescriptions/prescriptions/${id}/analyze/`
    );

    return response.data;

};



// =========================
// جلب كل الروشتات
// =========================

export const getPrescriptions = async () => {

    const response = await api.get(
        "/prescriptions/prescriptions/"
    );

    return response.data;

};



// =========================
// جلب روشتة واحدة
// =========================

export const getPrescription = async (id) => {

    const response = await api.get(
        `/prescriptions/prescriptions/${id}/`
    );

    return response.data;

};



// =========================
// قبول الروشتة
// =========================

export const approvePrescription = async (id) => {

    const response = await api.post(
        `/prescriptions/prescriptions/${id}/approve/`
    );

    return response.data;

};



// =========================
// رفض الروشتة
// =========================

export const rejectPrescription = async (id) => {

    const response = await api.post(
        `/prescriptions/prescriptions/${id}/reject/`
    );

    return response.data;

};