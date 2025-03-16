FROM python:3.13


WORKDIR /app


COPY ./requirements.txt .


RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt


COPY ./main.py ./fonts/ ./

EXPOSE 8080
CMD ["python", "main.py"]
