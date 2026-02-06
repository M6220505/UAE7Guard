// ============================================================================
// UAE7Guard - Supabase Auth Service for iOS
// ============================================================================
// Direct connection to Supabase Auth - NO Backend middleware
// ============================================================================

import Foundation
import Supabase

// MARK: - Configuration

struct SupabaseConfig {
    // ⚠️ Get these from Supabase Dashboard > Settings > API
    static let url = URL(string: "YOUR_SUPABASE_URL")!
    static let anonKey = "YOUR_SUPABASE_ANON_KEY"

    // ❌ NEVER use Service Role Key in iOS app
}

// MARK: - Supabase Client

let supabase = SupabaseClient(
    supabaseURL: SupabaseConfig.url,
    supabaseKey: SupabaseConfig.anonKey
)

// MARK: - Auth Service

class SupabaseAuthService: ObservableObject {
    static let shared = SupabaseAuthService()

    @Published var currentUser: User?
    @Published var isAuthenticated = false
    @Published var isLoading = false
    @Published var errorMessage: String?

    private init() {
        // Listen for auth state changes
        Task {
            for await state in supabase.auth.authStateChanges {
                await MainActor.run {
                    self.currentUser = state.session?.user
                    self.isAuthenticated = state.session != nil
                }
            }
        }
    }

    // MARK: - Sign Up

    func signUp(email: String, password: String, firstName: String? = nil, lastName: String? = nil) async throws {
        isLoading = true
        errorMessage = nil

        defer { isLoading = false }

        do {
            let response = try await supabase.auth.signUp(
                email: email,
                password: password,
                data: [
                    "first_name": .string(firstName ?? ""),
                    "last_name": .string(lastName ?? "")
                ]
            )

            // Check if email confirmation is required
            if response.session == nil {
                // Email confirmation required - inform user
                errorMessage = "Please check your email to confirm your account"
            }

        } catch let error as AuthError {
            errorMessage = error.localizedDescription
            throw error
        }
    }

    // MARK: - Sign In

    func signIn(email: String, password: String) async throws {
        isLoading = true
        errorMessage = nil

        defer { isLoading = false }

        do {
            let session = try await supabase.auth.signIn(
                email: email,
                password: password
            )

            await MainActor.run {
                self.currentUser = session.user
                self.isAuthenticated = true
            }

        } catch let error as AuthError {
            errorMessage = error.localizedDescription
            throw error
        }
    }

    // MARK: - Sign Out

    func signOut() async throws {
        isLoading = true
        errorMessage = nil

        defer { isLoading = false }

        try await supabase.auth.signOut()

        await MainActor.run {
            self.currentUser = nil
            self.isAuthenticated = false
        }
    }

    // MARK: - Get Access Token (for Backend API calls)

    func getAccessToken() async throws -> String? {
        let session = try await supabase.auth.session
        return session.accessToken
    }

    // MARK: - Password Reset

    func resetPassword(email: String) async throws {
        isLoading = true
        errorMessage = nil

        defer { isLoading = false }

        try await supabase.auth.resetPasswordForEmail(email)
    }

    // MARK: - Check Session

    func checkSession() async {
        do {
            let session = try await supabase.auth.session
            await MainActor.run {
                self.currentUser = session.user
                self.isAuthenticated = true
            }
        } catch {
            await MainActor.run {
                self.currentUser = nil
                self.isAuthenticated = false
            }
        }
    }
}

// MARK: - API Service (For Backend calls with JWT)

class APIService {
    static let shared = APIService()

    private let baseURL = "YOUR_BACKEND_URL" // e.g., "https://api.uae7guard.com"

    /// Make authenticated API request to Backend
    /// Backend verifies JWT from Supabase - no custom auth needed
    func request<T: Decodable>(
        endpoint: String,
        method: String = "GET",
        body: Encodable? = nil
    ) async throws -> T {

        // Get access token from Supabase
        guard let accessToken = try await SupabaseAuthService.shared.getAccessToken() else {
            throw APIError.unauthorized
        }

        // Build request
        var request = URLRequest(url: URL(string: "\(baseURL)\(endpoint)")!)
        request.httpMethod = method
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        if let body = body {
            request.httpBody = try JSONEncoder().encode(body)
        }

        // Execute request
        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }

        switch httpResponse.statusCode {
        case 200...299:
            return try JSONDecoder().decode(T.self, from: data)
        case 401:
            throw APIError.unauthorized
        case 403:
            throw APIError.forbidden
        default:
            throw APIError.serverError(httpResponse.statusCode)
        }
    }
}

enum APIError: Error, LocalizedError {
    case unauthorized
    case forbidden
    case invalidResponse
    case serverError(Int)

    var errorDescription: String? {
        switch self {
        case .unauthorized:
            return "Please sign in to continue"
        case .forbidden:
            return "You don't have permission to perform this action"
        case .invalidResponse:
            return "Invalid server response"
        case .serverError(let code):
            return "Server error: \(code)"
        }
    }
}

// MARK: - Usage Examples

/*

 // ============================================================================
 // SIGN UP
 // ============================================================================

 Task {
     do {
         try await SupabaseAuthService.shared.signUp(
             email: "user@example.com",
             password: "securePassword123",
             firstName: "Ahmed",
             lastName: "Mohammed"
         )
         // Success - check email for confirmation (if enabled)
     } catch {
         print("Sign up failed: \(error.localizedDescription)")
     }
 }

 // ============================================================================
 // SIGN IN
 // ============================================================================

 Task {
     do {
         try await SupabaseAuthService.shared.signIn(
             email: "user@example.com",
             password: "securePassword123"
         )
         // Success - user is now authenticated
         print("User ID: \(SupabaseAuthService.shared.currentUser?.id ?? "none")")
     } catch {
         print("Sign in failed: \(error.localizedDescription)")
     }
 }

 // ============================================================================
 // SIGN OUT
 // ============================================================================

 Task {
     try await SupabaseAuthService.shared.signOut()
 }

 // ============================================================================
 // API CALL TO BACKEND (with JWT)
 // ============================================================================

 struct ScamReport: Codable {
     let id: String
     let address: String
     let riskLevel: String
 }

 Task {
     do {
         let reports: [ScamReport] = try await APIService.shared.request(
             endpoint: "/api/reports",
             method: "GET"
         )
         print("Found \(reports.count) reports")
     } catch {
         print("API call failed: \(error.localizedDescription)")
     }
 }

 */
