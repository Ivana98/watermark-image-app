FROM python:3.13-slim

WORKDIR /app

COPY ./requirements.txt .

RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

COPY main.py /app/
COPY fonts /app/fonts

# RUN echo "Listing build context..." && ls -l ./
# RUN echo "Listing fonts context..." && ls -l ./fonts/

# -u forces unbuffered output to stdout and stderr across the whole script
CMD ["python", "-u", "main.py"]
