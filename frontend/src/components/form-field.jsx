import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FormField = ({ id, label, type = "text", placeholder, required, value, onChange, error }) => (
    <div className="grid gap-2">
        <Label htmlFor={id}>{label}</Label>
        <Input
            id={id}
            type={type}
            placeholder={placeholder}
            required={required}
            value={value}
            onChange={onChange}
        />
        {error && <span className="text-red-500">{error}</span>}
    </div>
);

export default FormField;