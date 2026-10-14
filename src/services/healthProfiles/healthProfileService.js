import api from "../../api/axios";

// =========================================================
// Health Profiles
// =========================================================

export const getHealthProfiles = async (params = {}) => {
    const { data } = await api.get("/patients/", {
        params,
    });

    return data;
};

export const getHealthProfileDetails = async (id) => {
    const { data } = await api.get(
        `/patients/${id}/full-profile/`
    );

    return data;
};

export const createHealthProfile = async (payload) => {
    const { data } = await api.post(
        "/patients/",
        payload
    );

    return data;
};

export const updateHealthProfile = async (id, payload) => {
    const { data } = await api.patch(
        `/patients/${id}/`,
        payload
    );

    return data;
};

export const deleteHealthProfile = async (id) => {
    await api.delete(`/patients/${id}/`);
};

// =========================================================
// Chronic Diseases
// =========================================================

export const getChronicDiseases = async (params = {}) => {
    const { data } = await api.get(
        "/patients/chronic-diseases/",
        { params }
    );

    return data;
};

export const getHealthProfileDiseases = async (patientId) => {
    const { data } = await api.get(
        "/patients/patient-diseases/",
        {
            params: {
                patient: patientId,
            },
        }
    );

    return data;
};

export const addHealthProfileDisease = async (payload) => {
    const { data } = await api.post(
        "/patients/patient-diseases/",
        payload
    );

    return data;
};

export const updateHealthProfileDisease = async (id, payload) => {
    const { data } = await api.patch(
        `/patients/patient-diseases/${id}/`,
        payload
    );

    return data;
};

export const deleteHealthProfileDisease = async (id) => {
    await api.delete(`/patients/patient-diseases/${id}/`);
};

// =========================================================
// Medications
// =========================================================

export const getHealthProfileMedications = async (patientId) => {
    const { data } = await api.get(
        "/patients/patient-medications/",
        {
            params: {
                patient: patientId,
            },
        }
    );

    return data;
};

export const createHealthProfileMedication = async (payload) => {
    const { data } = await api.post(
        "/patients/patient-medications/",
        payload
    );

    return data;
};

export const updateHealthProfileMedication = async (id, payload) => {
    const { data } = await api.patch(
        `/patients/patient-medications/${id}/`,
        payload
    );

    return data;
};

export const deleteHealthProfileMedication = async (id) => {
    await api.delete(
        `/patients/patient-medications/${id}/`
    );
};

// =========================================================
// Visits
// =========================================================

export const getHealthProfileVisits = async (patientId) => {
    const { data } = await api.get(
        "/patients/patient-visits/",
        {
            params: {
                patient: patientId,
            },
        }
    );

    return data;
};

export const createHealthProfileVisit = async (payload) => {
    const { data } = await api.post(
        "/patients/patient-visits/",
        payload
    );

    return data;
};

export const updateHealthProfileVisit = async (id, payload) => {
    const { data } = await api.patch(
        `/patients/patient-visits/${id}/`,
        payload
    );

    return data;
};

export const deleteHealthProfileVisit = async (id) => {
    await api.delete(`/patients/patient-visits/${id}/`);
};

// =========================================================
// Follow-ups
// =========================================================

export const getHealthProfileFollowUps = async (patientId) => {
    const { data } = await api.get(
        "/patients/patient-follow-ups/",
        {
            params: {
                patient: patientId,
            },
        }
    );

    return data;
};

export const createHealthProfileFollowUp = async (payload) => {
    const { data } = await api.post(
        "/patients/patient-follow-ups/",
        payload
    );

    return data;
};

export const updateHealthProfileFollowUp = async (id, payload) => {
    const { data } = await api.patch(
        `/patients/patient-follow-ups/${id}/`,
        payload
    );

    return data;
};

export const deleteHealthProfileFollowUp = async (id) => {
    await api.delete(
        `/patients/patient-follow-ups/${id}/`
    );
};

// =========================================================
// Follow-up Products
// =========================================================

export const getFollowUpProducts = async (followUpId) => {
    const { data } = await api.get(
        "/patients/patient-follow-up-products/",
        {
            params: {
                follow_up: followUpId,
            },
        }
    );

    return data;
};

export const createFollowUpProduct = async (payload) => {
    const { data } = await api.post(
        "/patients/patient-follow-up-products/",
        payload
    );

    return data;
};

export const updateFollowUpProduct = async (id, payload) => {
    const { data } = await api.patch(
        `/patients/patient-follow-up-products/${id}/`,
        payload
    );

    return data;
};

export const deleteFollowUpProduct = async (id) => {
    await api.delete(
        `/patients/patient-follow-up-products/${id}/`
    );
};