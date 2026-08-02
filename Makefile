.PHONY: install dev build lint typecheck test clean env-check

# ── Workspace Commands ──────────────────────────────────────────────────
install:
	npm install

dev:
	npm run dev --workspaces --if-present

build:
	npm run build --workspaces --if-present

lint:
	npm run lint --workspaces --if-present

typecheck:
	npm run typecheck --workspaces --if-present

test:
	npm test --workspaces --if-present

clean:
	npm run clean --workspaces --if-present

env-check:
	@echo "Checking required environment variables..."
	@node -e "\
	  const required = ['SUPABASE_SERVICE_ROLE_KEY','NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_ANON_KEY'];\
	  const missing = required.filter(k => !process.env[k]);\
	  if (missing.length) {\
	    console.error('Missing:', missing.join(', '));\
	    process.exit(1);\
	  } else {\
	    console.log('All', required.length, 'required keys present');\
	  }\
	"