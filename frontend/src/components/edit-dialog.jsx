import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import FormField from '@/components/form-field';
import SelectField from '@/components/select-field';
import { Button } from '@/components/ui/button';

const EditDialog = ({ field, value, onSave, children }) => {
    const [newFieldValue, setNewFieldValue] = useState(value);
    const [isOpen, setIsOpen] = useState(false);

    const handleSaveChanges = () => {
        setIsOpen(false);
        onSave(field, newFieldValue);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div onClick={() => setIsOpen(true)}>
                    {children}
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit your {field}</DialogTitle>
                    <DialogDescription>
                        Make changes to your {field} here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 items-center">
                        {field === 'sex' ? (
                            <SelectField
                                id={field}
                                label="Sex"
                                options={[
                                    { value: "male", label: "Male" },
                                    { value: "female", label: "Female" },
                                ]}
                                value={newFieldValue}
                                onChange={(id, value) => setNewFieldValue(value)}
                            />
                        ) : (
                            <FormField
                                id={field}
                                label={field.charAt(0).toUpperCase() + field.slice(1)}
                                value={newFieldValue}
                                onChange={(e) => setNewFieldValue(e.target.value)}
                            />
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSaveChanges}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditDialog;