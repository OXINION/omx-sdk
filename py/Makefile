.PHONY: install build clean test publish help

help:
	@echo "OMX SDK Python - Build Commands"
	@echo ""
	@echo "Available commands:"
	@echo "  make install    - Install dependencies"
	@echo "  make build      - Build distribution packages (wheel + sdist)"
	@echo "  make clean      - Remove build artifacts"
	@echo "  make test       - Run tests"
	@echo "  make publish    - Publish to PyPI"
	@echo "  make dev        - Install in development mode"
	@echo ""

install:
	@echo "Installing dependencies..."
	pip3 install -e ".[dev]"

dev:
	@echo "Installing in development mode..."
	pip3 install -e .

build: clean
	@echo "Building Python package..."
	pip3 install --upgrade build
	python3 -m build
	@echo ""
	@echo "✅ Build complete! Packages created in dist/"
	@ls -lh dist/

clean:
	@echo "Cleaning build artifacts..."
	rm -rf dist/
	rm -rf build/
	rm -rf src/*.egg-info
	rm -rf src/omx_sdk.egg-info
	rm -rf .pytest_cache
	rm -rf htmlcov
	rm -rf .coverage
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	@echo "✅ Clean complete!"

test:
	@echo "Running tests..."
	python3 -m pytest tests/ -v

test-cov:
	@echo "Running tests with coverage..."
	python3 -m pytest tests/ -v --cov=omx_sdk --cov-report=html --cov-report=term

publish: build
	@echo "Publishing to PyPI..."
	pip3 install --upgrade twine
	python3 -m twine upload dist/*
	@echo "✅ Published to PyPI!"

publish-test: build
	@echo "Publishing to TestPyPI..."
	pip3 install --upgrade twine
	python3 -m twine upload --repository testpypi dist/*
	@echo "✅ Published to TestPyPI!"
