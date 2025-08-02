import asyncio
from typing import Dict

active_connections: Dict[str, asyncio.Queue] = {}
