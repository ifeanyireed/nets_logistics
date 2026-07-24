package middleware

import (
	"net/http"
	"strings"
)

func CORSMiddleware(allowedOriginsStr string, next http.Handler) http.Handler {
	origins := strings.Split(allowedOriginsStr, ",")
	allowedMap := make(map[string]bool)
	allowAll := false

	for _, o := range origins {
		trimmed := strings.TrimSpace(o)
		if trimmed == "*" {
			allowAll = true
		}
		allowedMap[trimmed] = true
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")

		if allowAll {
			w.Header().Set("Access-Control-Allow-Origin", "*")
		} else if origin != "" && allowedMap[origin] {
			w.Header().Set("Access-Control-Allow-Origin", origin)
		} else if len(origins) > 0 {
			w.Header().Set("Access-Control-Allow-Origin", strings.TrimSpace(origins[0]))
		}

		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
		w.Header().Set("Access-Control-Max-Age", "86400")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
