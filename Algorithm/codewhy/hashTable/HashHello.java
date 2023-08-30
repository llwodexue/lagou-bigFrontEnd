import java.util.ArrayList;
import java.util.LinkedList;
import java.util.HashMap;
// import java.util.Hashtable;

class HashHello {

  public static void main(String[] args) {
    // >>>
    System.out.println(tableSizeFor(13));
    
    // HashCode与equals
    HashMap<User, String> hashMap = new HashMap<>();
    String str = new String("zhang");
    hashMap.put(new User(str), "123");
    System.out.println(hashMap.get(new User(str)));

    // String StringBuffer StringBuilder
    String s1 = "ab";
    StringBuffer s2 = new StringBuffer();
    s2.append("a");
    s2.append("b");
    StringBuilder s3 = new StringBuilder();
    s3.append("a");
    s3.append("b");
    System.out.println(s1);
    System.out.println(s2);
    System.out.println(s3);

    // ArrayList LinkedList
    ArrayList<Integer> a1 = new ArrayList<>();
    a1.add(0, 2);
    LinkedList<Integer> a2 = new LinkedList<>();
    a2.add(0, 2);
    a2.add(1, 3);
    System.out.println(a1);
    System.out.println(a2);
    System.out.println(hashCodeFn(a2));
  }

  private static int hashCodeFn(LinkedList<Integer> a2) {
    int h = 0;
    for (int v : a2) {
      h = 31 * h + (v & 0xff);
    }
    return h;
  }

  static final int tableSizeFor(int cap) {
    int n = cap - 1;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    return (n < 0) ? 1 : n + 1;
  }
}