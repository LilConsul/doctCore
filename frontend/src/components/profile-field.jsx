import React from 'react';
import { Button } from '@/components/ui/button';
import EditDialog from '@/components/edit-dialog';

const ProfileField = ({ field, value, onEdit }) => {
    return (
        <div className="flex justify-between items-center">
            <span className="mx-4">{field.charAt(0).toUpperCase() + field.slice(1)}: {value}</span>
            <EditDialog field={field} value={value} onSave={onEdit}>
                <Button variant="outline">Edit</Button>
            </EditDialog>
        </div>
    );
};

export default ProfileField;