"""User history module"""

from typing import List, Dict, Optional, TypedDict

class HistoryEntry(TypedDict):
    user_id: int
    username: str
    product_id: str


DEFAULT_SELECTION_HISTORY: List[str] = [
    "1 user1 lemon-tart",
    "1 user1 cheesecake",
    "2 user2 choco-cornet",
    "3 user3 vanilla-ice",
]


def parse_selection_history(lines: List[str]) -> List[HistoryEntry]:
    """文字列リストを構造化履歴に変換"""
    history: List[HistoryEntry] = []
    for line in lines:
        text = line.strip()
        if not text:
            continue

        parts = text.split()
        if len(parts) < 3:
            continue

        try:
            user_id = int(parts[0])
        except ValueError:
            continue

        username = parts[1]
        product_id = " ".join(parts[2:])

        history.append({"user_id": user_id, "username": username, "product_id": product_id})

    return history


def get_selected_products_by_user_id(user_id: int, lines: Optional[List[str]] = None) -> List[str]:
    """指定 user_id に紐づく選択商品IDリストを返す"""
    entries = lines if lines is not None else DEFAULT_SELECTION_HISTORY
    history = parse_selection_history(entries)
    return [e["product_id"] for e in history if e["user_id"] == user_id]


def get_selected_products_by_username(username: str, lines: Optional[List[str]] = None) -> List[str]:
    """指定 username に紐づく選択商品IDリストを返す"""
    entries = lines if lines is not None else DEFAULT_SELECTION_HISTORY
    history = parse_selection_history(entries)
    return [e["product_id"] for e in history if e["username"] == username]


if __name__ == "__main__":
    print(parse_selection_history(DEFAULT_SELECTION_HISTORY))
    print("user_id=1 history:", get_selected_products_by_user_id(1))
    print("user_id=2 history:", get_selected_products_by_user_id(2))
    print("user1 history:", get_selected_products_by_username("user1"))

