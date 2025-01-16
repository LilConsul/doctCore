from .base_repo import BaseRepo
from ..model.models import MedicalRecord
from sqlalchemy.sql import text
from ..service.database import db
from . import PatientsRepository, UsersRepository, DoctorsRepository


class MedicalRecordRepository(BaseRepo):
    table_name = 'medical_records'
    model = MedicalRecord


    @staticmethod
    async def get_all_medical_records():
        sql = text(f"""
        SELECT 
            r.id,
            r.diagnosis,
            r.treatment,
            r.date,
            p.blood_type,
            p.address,
            p.birthdate,
            u.name,
            u.email,
            u.phone
        FROM {MedicalRecordRepository.table_name} r
        INNER JOIN {PatientsRepository.table_name} p ON r.patient_id = p.id
        INNER JOIN {UsersRepository.table_name} u ON p.user_id = u.id;
        """)
        result = await db.exec_sql(sql)
        return result

    @staticmethod
    async def create_medical_record(medical_record: MedicalRecord, doctor_email: str):
        doct_id = await DoctorsRepository.get_doctor_id(doctor_email)
        if not doct_id:
            return None
        medical_record.doctor_id = doct_id
        result = await MedicalRecordRepository.create(**medical_record.dict())
        return result