import api from "../../api/axios";


/* ==========================================
   Get All Prescriptions
========================================== */

export const getPrescriptions = async () => {

    const { data } = await api.get(
        "/prescriptions/prescriptions/"
    );

    return data;
};


/* ==========================================
   Get Prescription Details
========================================== */

export const getPrescription = async (id) => {

    const { data } = await api.get(
        `/prescriptions/prescriptions/${id}/`
    );

    return data;
};


/* ==========================================
   Upload + Analyze Prescription
========================================== */

export const uploadPrescription = async (
    formData
) => {

    const { data } = await api.post(
        "/prescriptions/prescriptions/",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return data;
};


/* ==========================================
   Re-analyze Prescription
========================================== */

export const analyzePrescription = async (
    id
) => {

    const { data } = await api.post(
        `/prescriptions/prescriptions/${id}/analyze/`
    );

    return data;
};


/* ==========================================
   Approve Prescription
========================================== */

export const approvePrescription = async (
    id
) => {

    const { data } = await api.post(
        `/prescriptions/prescriptions/${id}/approve/`
    );

    return data;
};


/* ==========================================
   Reject Prescription
========================================== */

export const rejectPrescription = async (
    id
) => {

    const { data } = await api.post(
        `/prescriptions/prescriptions/${id}/reject/`
    );

    return data;
};


/* ==========================================
   Delete Prescription
========================================== */

export const deletePrescription = async (
    id
) => {

    const { data } = await api.delete(
        `/prescriptions/prescriptions/${id}/`
    );

    return data;
};