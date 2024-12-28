FROM python:3.13-slim
RUN python -m pip install --upgrade pip

WORKDIR /app
COPY ./requirements.txt /app
RUN pip install --no-cache-dir -r requirements.txt

COPY ./ ./
