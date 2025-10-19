from pydantic import BaseModel
from typing import Dict

class Test(BaseModel):
    balances: Dict[str, float]

print('ok')