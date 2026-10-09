import api from "../../api/axios";


export const getHealthProfiles = async () => {
    const { data } = await api.get("/patients/");
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


export const updateHealthProfile = async (
    id,
    payload
) => {
    const { data } = await api.patch(
        `/patients/${id}/`,
        payload
    );

    return data;
};


export const deleteHealthProfile = async (id) => {
    const { data } = await api.delete(
        `/patients/${id}/`
    );

    return data;
};


export const getChronicDiseases = async () => {
    const { data } = await api.get(
        "/patients/chronic-diseases/"
    );

    return data;
};


export const getHealthProfileDiseases = async (
    patientId
) => {
    const { data } = await api.get(
        `/patients/patient-diseases/?patient=${patientId}`
    );

    return data;
};


export const addHealthProfileDisease = async (
    payload
) => {
    const { data } = await api.post(
        "/patients/patient-diseases/",
        payload
    );

    return data;
};


export const updateHealthProfileDisease = async (
    id,
    payload
) => {
    const { data } = await api.patch(
        `/patients/patient-diseases/${id}/`,
        payload
    );

    return data;
};


export const deleteHealthProfileDisease = async (
    id
) => {
    const { data } = await api.delete(
        `/patients/patient-diseases/${id}/`
    );

    return data;
};


export const getHealthProfileMedications = async (
    patientId
) => {
    const { data } = await api.get(
        `/patients/medications/?patient=${patientId}`
    );

    return data;
};


export const createHealthProfileMedication = async (
    payload
) => {
    const { data } = await api.post(
        "/patients/medications/",
        payload
    );

    return data;
};


export const updateHealthProfileMedication = async (
    id,
    payload
) => {
    const { data } = await api.patch(
        `/patients/medications/${id}/`,
        payload
    );

    return data;
};


export const deleteHealthProfileMedication = async (
    id
) => {
    const { data } = await api.delete(
        `/patients/medications/${id}/`
    );

    return data;
};


export const getHealthProfileVisits = async (
    patientId
) => {
    const { data } = await api.get(
        `/patients/visits/?patient=${patientId}`
    );

    return data;
};


export const createHealthProfileVisit = async (
    payload
) => {
    const { data } = await api.post(
        "/patients/visits/",
        payload
    );

    return data;
};


export const updateHealthProfileVisit = async (
    id,
    payload
) => {
    const { data } = await api.patch(
        `/patients/visits/${id}/`,
        payload
    );

    return data;
};


export const deleteHealthProfileVisit = async (
    id
) => {
    const { data } = await api.delete(
        `/patients/visits/${id}/`
    );

    return data;
};


export const getHealthProfileFollowUps = async (
    patientId
) => {
    const { data } = await api.get(
        `/patients/follow-ups/patient/${patientId}/`
    );

    return data;
};


export const createHealthProfileFollowUp = async (
    payload
) => {
    const { data } = await api.post(
        "/patients/follow-ups/",
        payload
    );

    return data;
};


export const updateHealthProfileFollowUp = async (
    id,
    payload
) => {
    const { data } = await api.patch(
        `/patients/follow-ups/${id}/`,
        payload
    );

    return data;
};


export const deleteHealthProfileFollowUp = async (
    id
) => {
    const { data } = await api.delete(
        `/patients/follow-ups/${id}/`
    );

    return data;
};


export const getFollowUpProducts = async (
    followUpId
) => {
    const { data } = await api.get(
        `/patients/follow-up-products/?follow_up=${followUpId}`
    );

    return data;
};


export const createFollowUpProduct = async (
    payload
) => {
    const { data } = await api.post(
        "/patients/follow-up-products/",
        payload
    );

    return data;
};


export const updateFollowUpProduct = async (
    id,
    payload
) => {
    const { data } = await api.patch(
        `/patients/follow-up-products/${id}/`,
        payload
    );

    return data;
};


export const deleteFollowUpProduct = async (
    id
) => {
    const { data } = await api.delete(
        `/patients/follow-up-products/${id}/`
    );

    return data;
};