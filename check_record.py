import psycopg2
import sys

# --- Configuration ---
DATABASE_URL = "postgresql://postgres:Info4467@supa.clkvfvz5fxb3.ap-northeast-3.rds.amazonaws.com:5432/supa"
TABLE_NAME = "ammeter_log"
RECORD_ID = "ca59d2d8-415a-4b53-96ca-ab850c5f0601"

def check_record_exists():
    """Connects to the database and checks if a specific record exists."""
    conn = None
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()

        # Prepare the SELECT statement
        select_sql = f"SELECT COUNT(1) FROM public.{TABLE_NAME} WHERE id = %s"

        cur.execute(select_sql, (RECORD_ID,))
        count = cur.fetchone()[0]

        if count > 0:
            print(f"Record with ID '{RECORD_ID}' FOUND in the database.")
        else:
            print(f"Record with ID '{RECORD_ID}' NOT FOUND in the database.")

    except psycopg2.Error as e:
        print(f"Database error: {e}", file=sys.stderr)
    finally:
        if conn:
            cur.close()
            conn.close()

if __name__ == "__main__":
    check_record_exists()
