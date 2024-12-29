import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const SelectField = ({ id, label, options, value, onChange, error }) => (
    <div className="grid gap-2">
        <Label htmlFor={id}>{label}</Label>
        <Select onValueChange={(value) => onChange(id, value)}>
            <SelectTrigger>
                <SelectValue placeholder={`Select your ${label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
        {error && <span className="text-red-500">{error}</span>}
    </div>
);

export default SelectField;