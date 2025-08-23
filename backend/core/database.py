import os
from datetime import datetime
from typing import Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, String, Float, Integer, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.future import select
import uuid

# PostgreSQL 連線字串
DATABASE_URL = os.getenv("DATABASE_URL") or "postgresql+asyncpg://postgres:Info4467@supa.clkvfvz5fxb3.ap-northeast-3.rds.amazonaws.com:5432/supa"

# Enable pre-ping and connection recycling to avoid "connection was closed" errors
# pool_pre_ping checks connection liveness before using a connection from the pool
# pool_recycle ensures connections are refreshed periodically (in seconds)
engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    pool_recycle=1800,  # recycle connections every 30 minutes
)
async_session = async_sessionmaker(engine, expire_on_commit=False)
Base = declarative_base()

# ORM Model
class Ammeter(Base):
    __tablename__ = "ammeter"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    electricMeterNumber = Column(String, nullable=False)
    electricMeterName = Column(String, nullable=False)
    deviceNumber = Column(String, nullable=False, unique=True)
    factory = Column(String)
    device = Column(String)
    voltage = Column(Float)
    currents = Column(Float)
    power = Column(Float)
    battery = Column(Float)
    switchState = Column(Integer)
    networkState = Column(Integer)
    lastUpdated = Column(DateTime)
    organizationId = Column(String)
    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class AmmeterLog(Base):
    __tablename__ = "ammeter_log"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    deviceNumber = Column(String, nullable=False)
    action = Column(String, nullable=False)
    factory = Column(String)
    device = Column(String)
    voltage = Column(Float)
    currents = Column(Float)
    power = Column(Float)
    battery = Column(Float)
    switchState = Column(Integer)
    networkState = Column(Integer)
    lastUpdated = Column(DateTime)
    requestData = Column(Text)
    responseData = Column(Text)
    statusCode = Column(Integer)
    success = Column(Boolean, nullable=False)
    errorMessage = Column(Text)
    responseTime = Column(Integer)
    ipAddress = Column(String)
    userAgent = Column(String)
    userId = Column(String)
    organizationId = Column(String)
    createdAt = Column(DateTime, default=datetime.utcnow)

# 建表
async def init_database():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("PostgreSQL 資料表已建立")

# CRUD 範例
class DatabaseManager:
    def __init__(self):
        self.session_factory = async_session

    def get_session(self):
        """獲取資料庫會話"""
        return self.session_factory()

    def get_async_session(self):
        """獲取異步資料庫會話"""
        return self.session_factory()

    async def save_ammeter_data(self, ammeter_data: Dict[str, Any]) -> Optional[str]:
        async with self.session_factory() as session:
            # 依 deviceNumber 查找
            result = await session.execute(select(Ammeter).where(Ammeter.deviceNumber == ammeter_data["deviceNumber"]))
            ammeter = result.scalar_one_or_none()
            if ammeter:
                for k, v in ammeter_data.items():
                    if hasattr(ammeter, k):
                        setattr(ammeter, k, v)
                ammeter.updatedAt = datetime.utcnow()
            else:
                ammeter = Ammeter(**ammeter_data)
                session.add(ammeter)
            await session.commit()
            return ammeter.id

    async def get_all_ammeters(self) -> List[Ammeter]:
        async with self.session_factory() as session:
            result = await session.execute(select(Ammeter))
            return result.scalars().all()

    async def get_ammeter_logs(self, device_number: str = None, limit: int = 100) -> List[AmmeterLog]:
        async with self.session_factory() as session:
            stmt = select(AmmeterLog).order_by(AmmeterLog.createdAt.desc())
            if device_number:
                stmt = stmt.where(AmmeterLog.deviceNumber == device_number)
            if limit:
                stmt = stmt.limit(limit)
            result = await session.execute(stmt)
            return result.scalars().all()

    async def get_ammeter_history(self, device_number: str, start_date: datetime = None, end_date: datetime = None, limit: int = 1000) -> List[AmmeterLog]:
        """獲取電表歷史資料，用於分析"""
        async with self.session_factory() as session:
            stmt = select(AmmeterLog).where(
                AmmeterLog.deviceNumber == device_number,
                AmmeterLog.action == "ammeterDetail",
                AmmeterLog.success == True
            ).order_by(AmmeterLog.createdAt.desc())

            if start_date:
                stmt = stmt.where(AmmeterLog.createdAt >= start_date)
            if end_date:
                stmt = stmt.where(AmmeterLog.createdAt <= end_date)
            if limit:
                stmt = stmt.limit(limit)

            result = await session.execute(stmt)
            return result.scalars().all()

db_manager = DatabaseManager()
