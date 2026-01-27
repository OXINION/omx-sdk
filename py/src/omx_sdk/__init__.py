"""OMX SDK for Python - Official SDK for Oxinion Marketing Exchange."""

import os
from typing import Optional, Dict, Any, List
import httpx


class Location:
    def __init__(self, lat: float, lng: float):
        self.lat = lat
        self.lng = lng


class Notification:
    def __init__(self, title: str, body: str):
        self.title = title
        self.body = body


class GeoTrigger:
    def __init__(self, id: str, name: str, location: Location, radius: int, created_at: str):
        self.id = id
        self.name = name
        self.location = location
        self.radius = radius
        self.created_at = created_at


class NotificationResult:
    def __init__(self, message_id: str, status: str):
        self.message_id = message_id
        self.status = status


class Workflow:
    def __init__(self, id: str, name: str, status: str):
        self.id = id
        self.name = name
        self.status = status


class WorkflowExecution:
    def __init__(self, id: str, workflow_id: str, status: str):
        self.id = id
        self.workflow_id = workflow_id
        self.status = status


class AnalyticsStats:
    def __init__(self, total_triggers: int, unique_users: int, conversion_rate: float):
        self.total_triggers = total_triggers
        self.unique_users = unique_users
        self.conversion_rate = conversion_rate


class Segment:
    def __init__(self, id: str, name: str, user_count: int):
        self.id = id
        self.name = name
        self.user_count = user_count


class Campaign:
    def __init__(self, id: str, name: str, status: str):
        self.id = id
        self.name = name
        self.status = status


class EventTimeline:
    def __init__(self, events: List[Dict[str, Any]]):
        self.events = events


class GeoTriggerManager:
    def __init__(self, client: 'OMXClient'):
        self.client = client

    async def create(self, config: Dict[str, Any]) -> GeoTrigger:
        """Create a new geotrigger."""
        response = await self.client._make_request('POST', '/geotriggers', config)
        return GeoTrigger(
            id=response['id'],
            name=response['name'],
            location=Location(response['location']['lat'], response['location']['lng']),
            radius=response['radius'],
            created_at=response['createdAt']
        )

    async def list(self) -> List[GeoTrigger]:
        """List all geotriggers."""
        response = await self.client._make_request('GET', '/geotriggers')
        return [
            GeoTrigger(
                id=item['id'],
                name=item['name'],
                location=Location(item['location']['lat'], item['location']['lng']),
                radius=item['radius'],
                created_at=item['createdAt']
            )
            for item in response
        ]


class NotificationManager:
    def __init__(self, client: 'OMXClient'):
        self.client = client

    async def send_push_notification(self, data: Dict[str, Any]) -> NotificationResult:
        """Send a push notification."""
        response = await self.client._make_request('POST', '/notifications/push', data)
        return NotificationResult(
            message_id=response['messageId'],
            status=response['status']
        )


class WorkflowManager:
    def __init__(self, client: 'OMXClient'):
        self.client = client

    async def create_workflow(self, config: Dict[str, Any]) -> Workflow:
        """Create a new workflow."""
        response = await self.client._make_request('POST', '/workflows', config)
        return Workflow(
            id=response['id'],
            name=response['name'],
            status=response['status']
        )

    async def run_workflow(self, workflow_id: str) -> WorkflowExecution:
        """Execute a workflow."""
        response = await self.client._make_request('POST', f'/workflows/{workflow_id}/execute')
        return WorkflowExecution(
            id=response['id'],
            workflow_id=response['workflowId'],
            status=response['status']
        )

    async def list(self) -> List[Workflow]:
        """List all workflows."""
        response = await self.client._make_request('GET', '/workflows')
        return [
            Workflow(id=item['id'], name=item['name'], status=item['status'])
            for item in response
        ]


class AnalyticsManager:
    def __init__(self, client: 'OMXClient'):
        self.client = client

    async def get_geo_trigger_stats(self, params: Dict[str, Any]) -> AnalyticsStats:
        """Get geotrigger analytics stats."""
        query_params = {
            'geoTriggerId': params['geo_trigger_id']
        }
        if 'time_range' in params:
            query_params['timeRange'] = params['time_range']
        
        response = await self.client._make_request('GET', '/analytics/geotriggers', params=query_params)
        return AnalyticsStats(
            total_triggers=response['totalTriggers'],
            unique_users=response['uniqueUsers'],
            conversion_rate=response['conversionRate']
        )


class WebhookManager:
    def __init__(self, client: 'OMXClient'):
        self.client = client

    async def send_webhook(self, data: Dict[str, Any]) -> None:
        """Send a webhook."""
        await self.client._make_request('POST', '/webhooks/send', data)


class SegmentManager:
    def __init__(self, client: 'OMXClient'):
        self.client = client

    async def create_segment(self, config: Dict[str, Any]) -> Segment:
        """Create a new segment."""
        response = await self.client._make_request('POST', '/segments', config)
        return Segment(
            id=response['id'],
            name=response['name'],
            user_count=response['userCount']
        )

    async def get_segment_users(self, segment_id: str) -> List[Any]:
        """Get users in a segment."""
        return await self.client._make_request('GET', f'/segments/{segment_id}/users')

    async def list(self) -> List[Segment]:
        """List all segments."""
        response = await self.client._make_request('GET', '/segments')
        return [
            Segment(id=item['id'], name=item['name'], user_count=item['userCount'])
            for item in response
        ]


class CampaignManager:
    def __init__(self, client: 'OMXClient'):
        self.client = client

    async def create(self, config: Dict[str, Any]) -> Campaign:
        """Create a new campaign."""
        response = await self.client._make_request('POST', '/campaigns', config)
        return Campaign(
            id=response['id'],
            name=response['name'],
            status=response['status']
        )

    async def send(self, campaign_id: str) -> None:
        """Send a campaign."""
        await self.client._make_request('POST', f'/campaigns/{campaign_id}/send')

    async def list(self) -> List[Campaign]:
        """List all campaigns."""
        response = await self.client._make_request('GET', '/campaigns')
        return [
            Campaign(id=item['id'], name=item['name'], status=item['status'])
            for item in response
        ]


class EventsManager:
    def __init__(self, client: 'OMXClient'):
        self.client = client

    async def track_event(self, data: Dict[str, Any]) -> None:
        """Track an event."""
        await self.client._make_request('POST', '/events', data)

    async def get_event_timeline(self, params: Dict[str, Any]) -> EventTimeline:
        """Get event timeline."""
        query_params = {
            'userId': params['user_id']
        }
        if 'limit' in params:
            query_params['limit'] = str(params['limit'])
        
        response = await self.client._make_request('GET', '/events/timeline', params=query_params)
        return EventTimeline(events=response['events'])


class OMXClient:
    """Main OMX SDK client."""
    
    def __init__(self, client_id: Optional[str] = None, secret_key: Optional[str] = None, base_url: Optional[str] = None):
        """Initialize the OMX client.
        
        Args:
            client_id: OMX client ID (can also be set via OMX_CLIENT_ID env var)
            secret_key: OMX secret key (can also be set via OMX_SECRET_KEY env var)
            base_url: Base URL for the OMX API (can also be set via OMX_API_BASE_URL env var)
        """
        self.client_id = client_id or os.getenv('OMX_CLIENT_ID')
        self.secret_key = secret_key or os.getenv('OMX_SECRET_KEY')
        self.base_url = base_url or os.getenv('OMX_API_BASE_URL', 'https://blhilidnsybhfdmwqsrx.supabase.co/functions/v1')
        
        if not self.client_id or not self.secret_key:
            raise ValueError("client_id and secret_key are required. Set via parameters or OMX_CLIENT_ID/OMX_SECRET_KEY environment variables.")
        
        self._client = httpx.AsyncClient()
        
        # Initialize managers
        self.geo_trigger = GeoTriggerManager(self)
        self.notification = NotificationManager(self)
        self.workflow = WorkflowManager(self)
        self.analytics = AnalyticsManager(self)
        self.webhook = WebhookManager(self)
        self.segment = SegmentManager(self)
        self.campaign = CampaignManager(self)
        self.events = EventsManager(self)

    async def _make_request(self, method: str, endpoint: str, data: Optional[Dict[str, Any]] = None, params: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
        """Make an HTTP request to the OMX API."""
        url = f"{self.base_url}{endpoint}"
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.secret_key}',
            'X-Client-ID': self.client_id,
        }
        
        try:
            if method.upper() == 'GET':
                response = await self._client.get(url, headers=headers, params=params)
            elif method.upper() == 'POST':
                response = await self._client.post(url, headers=headers, json=data)
            elif method.upper() == 'PUT':
                response = await self._client.put(url, headers=headers, json=data)
            elif method.upper() == 'DELETE':
                response = await self._client.delete(url, headers=headers)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            response.raise_for_status()
            
            if response.content:
                return response.json()
            return {}
            
        except httpx.HTTPStatusError as e:
            raise Exception(f"API Error: {e.response.status_code} {e.response.text}")
        except Exception as e:
            raise Exception(f"Request failed: {str(e)}")

    async def close(self) -> None:
        """Close the HTTP client."""
        await self._client.aclose()

    async def __aenter__(self):
        """Async context manager entry."""
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        await self.close()


# Export main classes and functions
__all__ = [
    'OMXClient',
    'Location',
    'Notification',
    'GeoTrigger',
    'NotificationResult',
    'Workflow',
    'WorkflowExecution',
    'AnalyticsStats',
    'Segment',
    'Campaign',
    'EventTimeline',
]