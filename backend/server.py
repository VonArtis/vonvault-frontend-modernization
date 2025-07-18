from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
import json


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create routers
api_router = APIRouter(prefix="/api")
api_v1_router = APIRouter(prefix="/api/v1")

# Security
security = HTTPBearer()

# Mock authentication for demo
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # In production, validate the JWT token here
    return {"id": "user123", "email": "user@example.com"}

# Staking Models
class StakingInvestmentCreate(BaseModel):
    amount: float
    token: str
    network: str
    wallet_address: str
    tier: str
    apy: float

class StakingInvestment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    amount: float
    token: str
    network: str
    wallet_address: str
    tier: str
    apy: float
    start_date: datetime = Field(default_factory=datetime.utcnow)
    end_date: datetime
    status: str = "active"
    total_earned: float = 0.0
    current_value: float = 0.0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class StakingPortfolio(BaseModel):
    total_staked: float
    total_earned: float
    active_stakes: int
    matured_stakes: int
    current_tier: str
    next_tier: Optional[str]
    tier_progress: float
    investments: List[StakingInvestment]

class StakingAnalytics(BaseModel):
    performance: Dict[str, Any]
    tier_analytics: Dict[str, Any]
    monthly_earnings: List[Dict[str, Any]]
    token_distribution: List[Dict[str, Any]]

class VIPTier(BaseModel):
    id: str
    name: str
    min_amount: float
    max_amount: float
    apy: float
    emoji: str
    benefits: List[str]
    color: str


# VIP Tiers Configuration
VIP_TIERS_CONFIG = [
    {
        "id": "basic",
        "name": "BASIC",
        "min_amount": 0,
        "max_amount": 4999,
        "apy": 8.0,
        "icon": "basic",
        "benefits": ["Basic staking rewards", "Community access"],
        "color": "#22c55e"
    },
    {
        "id": "club",
        "name": "CLUB",
        "min_amount": 5000,
        "max_amount": 19999,
        "apy": 10.0,
        "icon": "club",
        "benefits": ["Enhanced rewards", "Priority support", "Exclusive events"],
        "color": "#eab308"
    },
    {
        "id": "premium",
        "name": "PREMIUM",
        "min_amount": 20000,
        "max_amount": 49999,
        "apy": 12.0,
        "icon": "premium",
        "benefits": ["Premium rewards", "Early access", "Personal advisor"],
        "color": "#8b5cf6"
    },
    {
        "id": "vip",
        "name": "VIP",
        "min_amount": 50000,
        "max_amount": 99999,
        "apy": 15.0,
        "icon": "vip",
        "benefits": ["VIP rewards", "Exclusive products", "Direct line support"],
        "color": "#f59e0b"
    },
    {
        "id": "elite",
        "name": "ELITE",
        "min_amount": 100000,
        "max_amount": float('inf'),
        "apy": 18.0,
        "icon": "elite",
        "benefits": ["Maximum rewards", "White-glove service", "Custom strategies"],
        "color": "#06b6d4"
    }
]

# Helper functions
def get_vip_tier_by_amount(amount: float) -> Dict[str, Any]:
    for tier in VIP_TIERS_CONFIG:
        if tier["min_amount"] <= amount <= tier["max_amount"]:
            return tier
    return VIP_TIERS_CONFIG[0]  # Default to basic

def calculate_end_date(start_date: datetime, months: int = 12) -> datetime:
    return start_date + timedelta(days=months * 30)

# === STAKING API ENDPOINTS ===

@api_v1_router.get("/staking/portfolio")
async def get_staking_portfolio(current_user: dict = Depends(get_current_user)):
    """Get user's staking portfolio"""
    try:
        # Mock data for demonstration
        mock_investments = [
            {
                "id": "stake_1",
                "user_id": current_user["id"],
                "amount": 25000,
                "token": "USDC",
                "network": "Ethereum",
                "wallet_address": "0x1234...5678",
                "tier": "PREMIUM",
                "apy": 12.0,
                "start_date": datetime.utcnow() - timedelta(days=180),
                "end_date": datetime.utcnow() + timedelta(days=185),
                "status": "active",
                "total_earned": 1500.0,
                "current_value": 26500.0,
                "created_at": datetime.utcnow() - timedelta(days=180),
                "updated_at": datetime.utcnow()
            },
            {
                "id": "stake_2",
                "user_id": current_user["id"],
                "amount": 15000,
                "token": "USDT",
                "network": "Polygon",
                "wallet_address": "0x9876...5432",
                "tier": "CLUB",
                "apy": 10.0,
                "status": "matured",
                "total_earned": 1200.0,
                "current_value": 16200.0,
                "start_date": datetime.utcnow() - timedelta(days=365),
                "end_date": datetime.utcnow() - timedelta(days=5),
                "created_at": datetime.utcnow() - timedelta(days=365),
                "updated_at": datetime.utcnow()
            }
        ]
        
        total_staked = sum(inv["amount"] for inv in mock_investments)
        total_earned = sum(inv["total_earned"] for inv in mock_investments)
        active_stakes = len([inv for inv in mock_investments if inv["status"] == "active"])
        matured_stakes = len([inv for inv in mock_investments if inv["status"] == "matured"])
        
        current_tier = get_vip_tier_by_amount(total_staked)
        next_tier_config = None
        for tier in VIP_TIERS_CONFIG:
            if tier["min_amount"] > total_staked:
                next_tier_config = tier
                break
        
        tier_progress = 0
        if next_tier_config:
            tier_progress = (total_staked - current_tier["min_amount"]) / (next_tier_config["min_amount"] - current_tier["min_amount"]) * 100
        
        return {
            "total_staked": total_staked,
            "total_earned": total_earned,
            "active_stakes": active_stakes,
            "matured_stakes": matured_stakes,
            "current_tier": current_tier["name"],
            "next_tier": next_tier_config["name"] if next_tier_config else None,
            "tier_progress": min(tier_progress, 100),
            "investments": mock_investments
        }
        
    except Exception as e:
        logger.error(f"Error getting staking portfolio: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_v1_router.post("/staking/create")
async def create_staking_investment(
    investment: StakingInvestmentCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create new staking investment"""
    try:
        # Validate amount
        if investment.amount < 1000:
            raise HTTPException(status_code=400, detail="Minimum staking amount is $1,000")
        
        if investment.amount > 250000:
            raise HTTPException(status_code=400, detail="Maximum staking amount is $250,000")
        
        # Create new staking investment
        new_investment = StakingInvestment(
            user_id=current_user["id"],
            amount=investment.amount,
            token=investment.token,
            network=investment.network,
            wallet_address=investment.wallet_address,
            tier=investment.tier,
            apy=investment.apy,
            end_date=calculate_end_date(datetime.utcnow()),
            current_value=investment.amount
        )
        
        # In production, save to database
        # await db.staking_investments.insert_one(new_investment.dict())
        
        return {
            "message": "Staking investment created successfully",
            "investment": new_investment.dict()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating staking investment: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_v1_router.get("/staking/history")
async def get_staking_history(
    current_user: dict = Depends(get_current_user),
    status: Optional[str] = None,
    sort: Optional[str] = "newest",
    page: Optional[int] = 1,
    limit: Optional[int] = 10
):
    """Get staking transaction history"""
    try:
        # Mock history data
        mock_history = [
            {
                "id": "tx_1",
                "type": "stake",
                "amount": 25000,
                "token": "USDC",
                "status": "completed",
                "date": datetime.utcnow() - timedelta(days=180),
                "transaction_hash": "0xabc123...",
                "tier": "PREMIUM",
                "apy": 12.0
            },
            {
                "id": "tx_2",
                "type": "reward",
                "amount": 250,
                "token": "USDC",
                "status": "completed",
                "date": datetime.utcnow() - timedelta(days=150),
                "tier": "PREMIUM",
                "apy": 12.0
            },
            {
                "id": "tx_3",
                "type": "stake",
                "amount": 15000,
                "token": "USDT",
                "status": "completed",
                "date": datetime.utcnow() - timedelta(days=365),
                "transaction_hash": "0xdef456...",
                "tier": "CLUB",
                "apy": 10.0
            }
        ]
        
        # Filter by status if provided
        if status and status != "all":
            mock_history = [h for h in mock_history if h["status"] == status]
        
        # Sort
        if sort == "oldest":
            mock_history.sort(key=lambda x: x["date"])
        else:
            mock_history.sort(key=lambda x: x["date"], reverse=True)
        
        # Paginate
        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        paginated_history = mock_history[start_idx:end_idx]
        
        return {
            "history": paginated_history,
            "total": len(mock_history),
            "page": page,
            "limit": limit,
            "total_pages": (len(mock_history) + limit - 1) // limit
        }
        
    except Exception as e:
        logger.error(f"Error getting staking history: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_v1_router.get("/staking/analytics")
async def get_staking_analytics(
    current_user: dict = Depends(get_current_user),
    timeframe: Optional[str] = "1y"
):
    """Get staking analytics data"""
    try:
        # Mock analytics data
        mock_analytics = {
            "performance": {
                "total_staked": 40000,
                "total_earned": 2700,
                "active_value": 42700,
                "roi_percentage": 6.75,
                "apy_average": 11.2
            },
            "tier_analytics": {
                "current_tier": "PREMIUM",
                "tier_benefits": ["Enhanced rewards", "Priority support", "Exclusive events"],
                "progress_to_next": 25.0,
                "next_tier_requirements": 50000
            },
            "monthly_earnings": [
                {"month": "2024-01", "earnings": 200, "stakes": 1},
                {"month": "2024-02", "earnings": 220, "stakes": 1},
                {"month": "2024-03", "earnings": 240, "stakes": 2},
                {"month": "2024-04", "earnings": 380, "stakes": 2},
                {"month": "2024-05", "earnings": 400, "stakes": 2},
                {"month": "2024-06", "earnings": 420, "stakes": 2}
            ],
            "token_distribution": [
                {"token": "USDC", "amount": 25000, "percentage": 62.5},
                {"token": "USDT", "amount": 15000, "percentage": 37.5}
            ]
        }
        
        return mock_analytics
        
    except Exception as e:
        logger.error(f"Error getting staking analytics: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_v1_router.post("/staking/claim/{investment_id}")
async def claim_staking_investment(
    investment_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Claim matured staking investment"""
    try:
        # In production, find and update the investment
        # investment = await db.staking_investments.find_one({"id": investment_id, "user_id": current_user["id"]})
        # if not investment:
        #     raise HTTPException(status_code=404, detail="Investment not found")
        
        # Mock successful claim
        return {
            "message": "Investment claimed successfully",
            "claimed_amount": 16200.0,
            "transaction_hash": "0xabc123def456..."
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error claiming staking investment: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_v1_router.get("/staking/tiers")
async def get_vip_tiers(current_user: dict = Depends(get_current_user)):
    """Get VIP tiers and requirements"""
    try:
        return {"tiers": VIP_TIERS_CONFIG}
    except Exception as e:
        logger.error(f"Error getting VIP tiers: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_v1_router.get("/staking/export")
async def export_staking_history(
    current_user: dict = Depends(get_current_user),
    format: str = "csv"
):
    """Export staking history to CSV/Excel"""
    try:
        # Mock CSV data
        csv_data = "Date,Type,Amount,Token,Status,Transaction Hash\n"
        csv_data += "2024-01-15,Stake,25000,USDC,Completed,0xabc123\n"
        csv_data += "2024-02-15,Reward,250,USDC,Completed,\n"
        csv_data += "2023-07-15,Stake,15000,USDT,Completed,0xdef456\n"
        
        return {
            "data": csv_data,
            "filename": f"staking_history_{datetime.now().strftime('%Y%m%d')}.csv"
        }
        
    except Exception as e:
        logger.error(f"Error exporting staking history: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include the routers in the main app
app.include_router(api_router)
app.include_router(api_v1_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
