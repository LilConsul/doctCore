import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const validateField = (id, value, formData, errors) => {
    const newErrors = { ...errors };
    const phoneRegex = /^\+48[\s]?[0-9]{3}[\s]?[0-9]{3}[\s]?[0-9]{3}$/;

    switch (id) {
        case "name":
            if (!value) newErrors.name = "Name is required";
            else delete newErrors.name;
            break;
        case "email":
            if (!value) newErrors.email = "Email is required";
            else delete newErrors.email;
            break;
        case "phone":
            if (!value || !phoneRegex.test(value)) newErrors.phone = "Valid phone number is required";
            else delete newErrors.phone;
            break;
        case "password":
            if (!value) newErrors.password = "Password is required";
            else delete newErrors.password;
            break;
        case "confirm_password":
            if (value !== formData.password) newErrors.confirm_password = "Passwords do not match";
            else delete newErrors.confirm_password;
            break;
        case "specialization":
            if (!value) newErrors.specialization = "Specialization is required";
            else delete newErrors.specialization;
            break;
        case "bio":
            if (!value) newErrors.bio = "Bio is required";
            else delete newErrors.bio;
            break;
        case "fee":
            if (!value || isNaN(value)) newErrors.fee = "Valid fee is required";
            else delete newErrors.fee;
            break;
        case "sex":
            if (!value) newErrors.sex = "Sex is required";
            else delete newErrors.sex;
            break;
        default:
            break;
    }

    return newErrors;
};