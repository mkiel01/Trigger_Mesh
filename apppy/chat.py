import socket
import threading

def listen_for_messages(sock):
    while True:
        message, addr = sock.recvfrom(1024)
        print(f"\n{addr[0]}:{addr[1]} - {message.decode('utf-8')}")
        print("> ", end="", flush=True)

def main():
    local_port = int(input("Enter your port: "))
    target_port = int(input("Enter target port: "))
    target_address = input("Enter target address: ")

    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.bind(('', local_port))

    threading.Thread(target=listen_for_messages, args=(sock,), daemon=True).start()

    name = input("Enter your name: ")
    print("> ", end="", flush=True)

    while True:
        message = input()
        full_message = f"{name}: {message}"
        sock.sendto(full_message.encode('utf-8'), (target_address, target_port))

if __name__ == "__main__":
    main()
