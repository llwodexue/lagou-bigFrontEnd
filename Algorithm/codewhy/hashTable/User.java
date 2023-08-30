public class User {
  private String name;

  public User(String name) {
    this.name = name;
  }

  public String getName() {
    return name;
  }

  @Override
  public boolean equals(Object obj) {
    User user = (User) obj;
    return user.getName().equals(this.name);
  }

  @Override
  public int hashCode(){
    return name.hashCode();
  }
}
