export interface RoommateRequest {
    request_id: number;
    requester_id: number;
    requester_lastname: string;
    requester_firstname: string;
    requester_status_id: number;
    requester_avatar: string;
    viewed: boolean;
    accepted: boolean | null;
}

export interface RoommateRequestsResponse {
    requests: RoommateRequest[];
}

export interface SentRoommateRequest {
    request_id: number;
    requester_id: number;
    target_id: number;
    target_firstname: string;
    target_lastname: string;
    target_avatar: string;
    target_status_id: number;
    accepted: boolean | null;
}

export interface SentRoommateRequestsResponse {
    requests: SentRoommateRequest[];
}


export interface RoommateRequestNotification {
    message: string;
    target_id: number;
}

export interface RequestViewedNotification {
    message: string;
    request_id: number;
}

export interface RoommateRequestDetails {
    requests: RoommateRequestDetails[];
    request_id: number;
    requester_id: number;
    requester_firstname: string;
    requester_lastname: string;
    requester_avatar: string;
    target_id: number;
    target_firstname: string;
    target_lastname: string;
    target_avatar: string;
    accepted: boolean | null;
    request_date: string;
}

export interface RoommateRequestsResponseDetails {
    requests: RoommateRequest[];
}

